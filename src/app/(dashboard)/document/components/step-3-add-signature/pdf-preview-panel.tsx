import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Loader2 } from "lucide-react";
import { SignaturePosition, DocumentPdfResponse } from "@/lib/types/document";
import {
  SIGNATURE_IMAGE_WIDTH,
  SIGNATURE_IMAGE_HEIGHT,
} from "@/lib/utils/signature";
import { DraggableSignature } from "@/components/pdf";
import { loadPdfDocument, renderPdfPage, PDF_SCALE } from "@/lib/utils/pdf";

interface PdfPreviewPanelProps {
  documentPdf: DocumentPdfResponse | null;
  signatureImage: string | null;
  signaturePosition: SignaturePosition;
  onSignatureDrag: (x: number, y: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onPdfScaleChange?: (scale: number) => void;
}

export default function PdfPreviewPanel({
  documentPdf,
  signatureImage,
  signaturePosition,
  onSignatureDrag,
  containerRef,
  onPdfScaleChange,
}: PdfPreviewPanelProps) {
  // Local canvas ref and state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRenderingRef = useRef(false);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

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
        const pdfDoc = await loadPdfDocument(documentPdf.publicUrl);
        const scale = await renderPdfPage(pdfDoc, 1, canvasRef.current!);
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
  }, [documentPdf, onPdfScaleChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Signature</CardTitle>
        <CardDescription>
          Drag signature to desired position on document
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          data-signature-container="true"
          className="relative min-h-[600px] rounded-lg border border-neutral-200 bg-white"
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
              {signatureImage && (
                <DraggableSignature
                  signatureImage={signatureImage}
                  position={{
                    x: signaturePosition.x,
                    y: signaturePosition.y,
                  }}
                  onDrag={onSignatureDrag}
                  containerRef={containerRef}
                  width={SIGNATURE_IMAGE_WIDTH}
                  height={SIGNATURE_IMAGE_HEIGHT}
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
