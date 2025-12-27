"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generatePDFPreview } from "@/lib/api/content";
import { useDebouncedCallback } from "use-debounce";
import PDFDocumentRenderer from "./PDFDocumentRenderer";
import { TiptapJson } from "@/lib/types/document";

/**
 * Props for PDFPreview component
 */
interface PDFPreviewProps {
  /** Document ID for PDF generation */
  documentId: string | null;
  /** Tiptap JSON content to convert to PDF */
  tiptapJson: TiptapJson;
}

/**
 * PDFPreview Component
 *
 * Wrapper component for PDF preview panel. Manages PDF data fetching
 * with debouncing and provides the UI shell (header, toolbar).
 *
 * This component is responsible for:
 * - Fetching PDF data from the API (debounced)
 * - Managing loading and error states
 * - Providing the preview panel UI
 * - Delegating actual rendering to PDFDocumentRenderer
 */
export default function PDFPreview({
  documentId,
  tiptapJson,
}: PDFPreviewProps) {
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  /**
   * Debounced preview function (500ms delay)
   * Generates PDF preview from Tiptap JSON content
   */
  const debouncedPreview = useDebouncedCallback(
    async (tiptapJson: TiptapJson) => {
      if (!documentId) return;

      try {
        setIsGeneratingPdf(true);
        setPreviewError(null);
        const pdfBytes = await generatePDFPreview(documentId, tiptapJson);
        setPdfData(pdfBytes);
      } catch (error) {
        console.error("Failed to generate preview:", error);
        setPreviewError(
          error instanceof Error ? error.message : "Unknown error"
        );
        // Don't block editing on preview failure
      } finally {
        setIsGeneratingPdf(false);
      }
    },
    500 // 500ms debounce delay
  );

  // Initialize preview on mount if content exists
  useEffect(() => {
    if (tiptapJson && documentId) {
      debouncedPreview(tiptapJson);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  // Update preview when tiptapJson changes
  useEffect(() => {
    if (tiptapJson) {
      debouncedPreview(tiptapJson);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiptapJson]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Live PDF Preview</CardTitle>
          </div>
          {isGeneratingPdf && (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
              <span>Generating...</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <PDFDocumentRenderer
          pdfData={pdfData}
          isLoading={isGeneratingPdf}
          error={previewError}
        />
      </CardContent>
    </Card>
  );
}
