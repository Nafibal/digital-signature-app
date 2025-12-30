import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  SignaturePosition,
  DocumentPdfResponse,
} from "@/features/document/types";
import {
  SIGNATURE_IMAGE_WIDTH,
  SIGNATURE_IMAGE_HEIGHT,
  PDF_SCALE,
  loadPdfDocument,
  renderPdfPage,
  getPdfPageCount,
} from "@/lib/helpers";
import { DraggableSignature } from "../pdf";

interface PdfPreviewPanelProps {
  documentPdf: DocumentPdfResponse | null;
  signatureImage: string | null;
  signaturePosition: SignaturePosition;
  onSignatureDrag: (x: number, y: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onPdfScaleChange?: (scale: number) => void;
  signatureDisplayWidth?: number;
  signatureDisplayHeight?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export default function PdfPreviewPanel({
  documentPdf,
  signatureImage,
  signaturePosition,
  onSignatureDrag,
  containerRef,
  onPdfScaleChange,
  signatureDisplayWidth,
  signatureDisplayHeight,
  currentPage = 1,
  onPageChange,
}: PdfPreviewPanelProps) {
  // Local canvas ref and state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRenderingRef = useRef(false);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [localCurrentPage, setLocalCurrentPage] = useState<number>(currentPage);

  // Update local page when currentPage prop changes
  useEffect(() => {
    setLocalCurrentPage(currentPage);
  }, [currentPage]);

  // Load and render PDF when documentPdf is available
  useLayoutEffect(() => {
    if (!documentPdf) {
      return;
    }

    // Don't start rendering until canvas is available
    if (!canvasRef.current) {
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
        if (!documentPdf.publicUrl) {
          throw new Error("PDF public URL is not available");
        }

        const pdfDoc = await loadPdfDocument(documentPdf.publicUrl);

        // Get total pages
        const pageCount = getPdfPageCount(pdfDoc);
        setTotalPages(pageCount);

        // Render the current page
        const scale = await renderPdfPage(
          pdfDoc,
          localCurrentPage,
          canvasRef.current!
        );
        // Notify parent of scale change
        if (onPdfScaleChange) {
          onPdfScaleChange(scale);
        }
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
  }, [documentPdf, onPdfScaleChange, localCurrentPage]);

  // Handle page navigation
  const handlePreviousPage = () => {
    if (localCurrentPage > 1) {
      const newPage = localCurrentPage - 1;
      setLocalCurrentPage(newPage);
      if (onPageChange) {
        onPageChange(newPage);
      }
    }
  };

  const handleNextPage = () => {
    if (localCurrentPage < totalPages) {
      const newPage = localCurrentPage + 1;
      setLocalCurrentPage(newPage);
      if (onPageChange) {
        onPageChange(newPage);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Place Signature</CardTitle>
            <CardDescription>
              Drag signature to desired position on document
            </CardDescription>
          </div>
          {totalPages > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={localCurrentPage === 1 || isPdfLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-20 text-center">
                Page {localCurrentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={localCurrentPage === totalPages || isPdfLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          data-signature-container="true"
          className="relative min-h-150 rounded-lg border border-neutral-200 bg-white"
        >
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
          {!documentPdf && (
            <div className="flex h-full items-center justify-center gap-3 text-neutral-400">
              <FileText className="h-12 w-12" />
              <div className="text-sm">
                <p className="font-medium">No PDF Available</p>
                <p className="text-xs">
                  PDF will be generated when you proceed from step 3.1
                </p>
              </div>
            </div>
          )}
          {documentPdf && (
            <>
              <canvas
                ref={canvasRef}
                className="w-full"
                style={{ display: "block" }}
              />
              {signatureImage &&
                signaturePosition.page === localCurrentPage && (
                  <DraggableSignature
                    signatureImage={signatureImage}
                    position={signaturePosition}
                    onDrag={onSignatureDrag}
                    containerRef={containerRef}
                    width={signatureDisplayWidth ?? SIGNATURE_IMAGE_WIDTH}
                    height={signatureDisplayHeight ?? SIGNATURE_IMAGE_HEIGHT}
                  />
                )}
            </>
          )}
        </div>

        {signatureImage && (
          <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <p className="text-sm text-neutral-600">
              <span className="font-medium">Visual Position:</span> X:{" "}
              {Math.round(signaturePosition.x)}, Y:{" "}
              {Math.round(signaturePosition.y)}, Page: {signaturePosition.page}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
