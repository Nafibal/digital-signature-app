"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  loadPdfDocument,
  renderPdfPage,
  PDF_SCALE,
  getPdfPageCount,
} from "@/lib/helpers";

interface SignedPdfPreviewProps {
  finalPdfUrl: string;
}

export default function SignedPdfPreview({
  finalPdfUrl,
}: SignedPdfPreviewProps) {
  // Local canvas ref and state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRenderingRef = useRef(false);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCanvasReady, setIsCanvasReady] = useState<boolean>(false);

  // Track when canvas is ready
  useEffect(() => {
    if (canvasRef.current) {
      setIsCanvasReady(true);
    }
  }, []);

  // Load and render PDF when finalPdfUrl and canvas are available
  useEffect(() => {
    if (!finalPdfUrl || finalPdfUrl.length === 0) {
      return;
    }

    // Don't start rendering until canvas is available
    if (!canvasRef.current || !isCanvasReady) {
      return;
    }

    if (isRenderingRef.current) {
      return;
    }

    isRenderingRef.current = true;
    setIsPdfLoading(true);
    setPdfError(null);

    const renderPdf = async () => {
      try {
        const pdfDoc = await loadPdfDocument(finalPdfUrl);

        // Get total pages
        const pageCount = getPdfPageCount(pdfDoc);
        setTotalPages(pageCount);

        // Render current page
        await renderPdfPage(pdfDoc, currentPage, canvasRef.current!);
      } catch (error) {
        setPdfError(
          error instanceof Error ? error.message : "Failed to load PDF"
        );
      } finally {
        isRenderingRef.current = false;
        setIsPdfLoading(false);
      }
    };

    renderPdf();
  }, [finalPdfUrl, currentPage, isCanvasReady]);

  // Handle page navigation
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Signed Document Preview</CardTitle>
            <CardDescription>
              Review your signed document before downloading
            </CardDescription>
          </div>
          {totalPages > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1 || isPdfLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[80px] text-center">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || isPdfLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative min-h-[600px] rounded-lg border border-neutral-200 bg-white">
          {isPdfLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
          )}
          {pdfError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <p className="text-sm text-red-500">{pdfError}</p>
            </div>
          )}
          {!finalPdfUrl && (
            <div className="flex h-full items-center justify-center gap-3 text-neutral-400">
              <FileText className="h-12 w-12" />
              <div className="text-sm">
                <p className="font-medium">No Signed PDF Available</p>
                <p className="text-xs">
                  Please sign your PDF in Step 3.2 first
                </p>
              </div>
            </div>
          )}
          {finalPdfUrl && !pdfError && (
            <canvas
              ref={canvasRef}
              className="w-full"
              style={{ display: "block" }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
