"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PDFDocumentProxy } from "pdfjs-dist";

interface PdfViewerProps {
  url: string;
  scale?: number;
}

export default function PdfViewer({ url, scale = 1.5 }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);

  useEffect(() => {
    let cancelled = false;

    const renderPdf = async () => {
      if (!url || !canvasRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // ✅ DYNAMIC IMPORT (browser-only)
        const pdfjsLib = await import("pdfjs-dist");

        // ✅ Worker setup (ESM, Next.js safe)
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.mjs",
          import.meta.url
        ).toString();

        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        setPdfDocument(pdf);
        setNumPages(pdf.numPages);

        const page = await pdf.getPage(currentPage);
        console.log("PDF page loaded:", page);
        const viewport = page.getViewport({ scale });
        console.log("PDF viewport:", viewport);

        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        console.log("Canvas:", canvas);

        await page.render({
          canvasContext: context,
          viewport,
          canvas, // ✅ add this
        }).promise;

        if (!cancelled) setIsLoading(false);
      } catch (err) {
        console.error("Error rendering PDF:", err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load PDF");
          setIsLoading(false);
        }
      }
    };

    renderPdf();

    return () => {
      cancelled = true;
    };
  }, [url, currentPage, scale]);

  useEffect(() => {
    return () => {
      pdfDocument?.destroy();
    };
  }, [pdfDocument]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-150">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 mx-auto mb-4" />
          <p className="text-sm text-neutral-500">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-150">
        <div className="text-center">
          <p className="text-sm text-red-600 mb-2">Failed to load PDF</p>
          <p className="text-xs text-neutral-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-600">
          Page {currentPage} of {numPages}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="border border-neutral-200 rounded shadow-sm"
        />
      </div>
    </div>
  );
}
