"use client";

import { useState, useRef, useEffect } from "react";
import { Step3aFormData } from "@/features/document/types";
import { RichTextEditorRef } from "./editor/RichTextEditor";
import EditorPanel from "./step-3-fill-content/EditorPanel";
import PreviewPanel from "./step-3-fill-content/PreviewPanel";

interface Step3FillContentProps {
  content: Step3aFormData;
  setContent: React.Dispatch<React.SetStateAction<Step3aFormData>>;
  documentId: string | null;
}

export default function Step3FillContent({
  content,
  setContent,
  documentId,
}: Step3FillContentProps) {
  const editorRef = useRef<RichTextEditorRef>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Handle editor updates
  const handleEditorUpdate = (updatedContent: {
    html: string;
    json: unknown;
  }) => {
    const newContent = { ...content, html: updatedContent.html };
    setContent(newContent);
  };

  // Handle preview generation
  const handlePreview = async () => {
    if (!editorRef.current || !documentId) return;

    setIsGeneratingPreview(true);
    setPreviewError(null);

    // Revoke previous blob URL to free memory
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    try {
      const html = editorRef.current.getHTML();

      const res = await fetch("/api/render-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (error) {
      console.error("Preview error:", error);
      setPreviewError(
        error instanceof Error ? error.message : "Failed to generate preview"
      );
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <EditorPanel
        editorRef={editorRef}
        content={content}
        onEditorUpdate={handleEditorUpdate}
      />
      <PreviewPanel
        previewUrl={previewUrl}
        isGeneratingPreview={isGeneratingPreview}
        previewError={previewError}
        onPreview={handlePreview}
        documentId={documentId}
      />
    </div>
  );
}
