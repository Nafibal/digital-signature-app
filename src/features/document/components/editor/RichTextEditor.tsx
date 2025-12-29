"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import EditorToolbar from "./EditorToolbar";
import { useEffect, forwardRef, useImperativeHandle } from "react";
import { TiptapJson, TiptapNode } from "@/lib/types/document";

interface RichTextEditorProps {
  onUpdate: (content: { html: string; json: TiptapJson }) => void;
  initialContent?: TiptapJson | string;
}

export interface RichTextEditorRef {
  getHTML: () => string;
}

// Helper function to sanitize content and remove empty text nodes
const sanitizeContent = (content: TiptapJson | string): TiptapJson | string => {
  // If it's a string (HTML), return it as is
  if (typeof content === "string") {
    return content;
  }

  if (!content || typeof content !== "object") {
    return "";
  }

  const sanitizeNode = (node: TiptapNode): TiptapNode | null => {
    if (!node) return null;

    // If it's a text node, only remove it if it's truly empty (no text at all)
    if (node.type === "text") {
      if (node.text === undefined || node.text === null) {
        return null;
      }
      // Keep text nodes that have content, even if just whitespace
      return node;
    }

    // If it has content, recursively sanitize
    if (node.content && Array.isArray(node.content)) {
      const sanitizedContent = node.content
        .map(sanitizeNode)
        .filter((child): child is TiptapNode => child !== null);

      // If after sanitization, content is empty and it's not a leaf node, return null
      if (sanitizedContent.length === 0) {
        return null;
      }

      return { ...node, content: sanitizedContent };
    }

    return node;
  };

  const sanitized = sanitizeNode(content);
  return (sanitized as TiptapJson) || "";
};

const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ onUpdate, initialContent }, ref) => {
    const sanitizedContent = sanitizeContent(initialContent || "");

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
          },
          // Disable features we don't want
          code: false, // Disable inline code
          codeBlock: false, // Disable code blocks
          // Disable underline from StarterKit to avoid duplicate extension error
          underline: false,
        }),
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
      ],
      content: sanitizedContent,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class:
            "tiptap-editor prose prose-sm max-w-none focus:outline-none min-h-75",
        },
      },
      onUpdate: ({ editor }: { editor: Editor }) => {
        onUpdate({
          html: editor.getHTML(),
          json: editor.getJSON(),
        });
      },
    });

    useEffect(() => {
      if (editor) {
        // Only call onUpdate if editor has content
        const html = editor.getHTML();
        const json = editor.getJSON();
        if (html && html !== "<p></p>") {
          onUpdate({
            html,
            json,
          });
        }
      }
    }, [editor]);

    // Expose getHTML method to parent component
    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML() || "",
    }));

    return (
      <div className="flex flex-col h-full bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
        <EditorToolbar editor={editor} />
        <div className="flex-1 overflow-auto p-6">
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
