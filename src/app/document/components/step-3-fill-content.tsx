"use client";

import { useState } from "react";
import { Step3aFormData, TiptapJson } from "@/lib/types/document";
import RichTextEditor from "./editor/RichTextEditor";
import PDFPreview from "@/components/pdf/PDFPreview";

interface Step3FillContentProps {
  content: Step3aFormData;
  setContent: React.Dispatch<React.SetStateAction<Step3aFormData>>;
  documentId: string | null;
  previewUrl: string | null;
  isGeneratingPreview: boolean;
}

export default function Step3FillContent({
  content,
  setContent,
  documentId,
  previewUrl,
  isGeneratingPreview,
}: Step3FillContentProps) {
  // Handle editor updates
  const handleEditorUpdate = (editorContent: {
    html: string;
    json: TiptapJson;
  }) => {
    const newContent = { ...content, body: editorContent.json };
    setContent(newContent);
    // Only update local state, no API call
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Editor Panel */}
      <RichTextEditor
        onUpdate={handleEditorUpdate}
        initialContent={content.body}
      />

      {/* Preview Panel - using extracted component */}
      <PDFPreview documentId={documentId} tiptapJson={content.body} />
    </div>
  );
}
