"use client";

import { useEffect, useMemo, memo } from "react";
import { FileText } from "lucide-react";
import PdfViewer from "./PdfViewer";

/**
 * Props for PDFDocumentRenderer component
 */
interface PDFDocumentRendererProps {
  /** PDF data as ArrayBuffer for rendering */
  pdfData: ArrayBuffer | null;
  /** Loading state indicator */
  isLoading: boolean;
  /** Error message if PDF loading/rendering failed */
  error: string | null;
}

/**
 * PDFDocumentRenderer Component
 *
 * Renders PDF documents using canvas-based pdf.js library. Handles page navigation,
 * PDF rendering, and displays loading/error/empty states.
 *
 * This component is responsible only for rendering - it does not fetch PDF data.
 * PDF data should be provided via props by a parent component.
 *
 * It converts ArrayBuffer to Blob URL for consumption by PdfViewer component.
 */
const PDFDocumentRenderer = memo(function PDFDocumentRenderer({
  pdfData,
  isLoading,
  error,
}: PDFDocumentRendererProps) {
  // Convert ArrayBuffer to Blob URL for pdf.js consumption
  const blobUrl = useMemo(() => {
    if (!pdfData) return null;
    const blob = new Blob([pdfData], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  }, [pdfData]);

  // Cleanup Blob URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-150">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 mx-auto mb-4" />
          <p className="text-sm text-neutral-500">Generating preview...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-150">
        <div className="text-center">
          <p className="text-sm text-red-600 mb-2">Preview failed</p>
          <p className="text-xs text-neutral-500">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state (no PDF data)
  if (!pdfData || !blobUrl) {
    return (
      <div className="flex items-center justify-center h-150">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
          <p className="text-sm text-neutral-600">
            Start editing to see live PDF preview
          </p>
        </div>
      </div>
    );
  }

  // PDF loaded state - delegate to canvas-based PdfViewer
  return <PdfViewer url={blobUrl} scale={1.5} />;
});

export default PDFDocumentRenderer;
