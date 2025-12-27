"use client";

import { useState, useRef, useEffect } from "react";
import { Step3aFormData, TiptapJson } from "@/lib/types/document";
import RichTextEditor, { RichTextEditorRef } from "./editor/RichTextEditor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Loader2, AlertCircle } from "lucide-react";

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
  const handleEditorUpdate = (editorContent: {
    html: string;
    json: TiptapJson;
  }) => {
    const newContent = { ...content, body: editorContent.json };
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
      {/* Editor Panel */}
      <div className="flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Document Content
          </h3>
          <p className="text-sm text-neutral-600">
            Write or paste your document content here
          </p>
        </div>
        <RichTextEditor
          ref={editorRef}
          onUpdate={handleEditorUpdate}
          initialContent={content.body}
        />
      </div>

      {/* Preview Panel - Manual Trigger */}
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>PDF Preview</CardTitle>
              <CardDescription>
                Click Preview to generate PDF from your content
              </CardDescription>
            </div>
            <Button
              onClick={handlePreview}
              disabled={isGeneratingPreview || !documentId}
              className="gap-2"
            >
              {isGeneratingPreview ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Preview
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {isGeneratingPreview && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-neutral-400 mx-auto mb-4" />
                <p className="text-sm text-neutral-600">
                  Generating PDF preview...
                </p>
              </div>
            </div>
          )}

          {previewError && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-sm font-medium text-red-900 mb-2">
                  Preview Failed
                </p>
                <p className="text-sm text-red-700">{previewError}</p>
              </div>
            </div>
          )}

          {!isGeneratingPreview && !previewError && !previewUrl && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-24 w-24 text-neutral-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-neutral-900 mb-2">
                  No Preview Generated
                </p>
                <p className="text-sm text-neutral-600 mb-4">
                  Click the Preview button to see how your document will look as
                  a PDF
                </p>
              </div>
            </div>
          )}

          {previewUrl && !isGeneratingPreview && !previewError && (
            <iframe
              src={previewUrl}
              className="w-full h-full min-h-[600px] border-0 rounded-lg"
              title="PDF Preview"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
