"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  SignaturePosition,
  Step3bFormData,
  DocumentPdfResponse,
} from "@/lib/types/document";
import {
  generateSignatureImage,
  SIGNATURE_IMAGE_WIDTH,
  SIGNATURE_IMAGE_HEIGHT,
} from "@/lib/utils/signature";
import { PDF_SCALE } from "@/lib/utils/pdf";
import {
  convertCanvasToPdfCoordinates,
  convertPdfToCanvasCoordinates,
  clampPosition,
  CanvasPosition,
} from "@/lib/utils/coordinates";
import SignatureForm from "./step-3-add-signature/signature-form";
import SignaturePreview from "./step-3-add-signature/signature-preview";
import SignatureStatus from "./step-3-add-signature/signature-status";
import SignatureSaveButton from "./step-3-add-signature/signature-save-button";
import PdfPreviewPanel from "./step-3-add-signature/pdf-preview-panel";
import { useGetSignatures } from "@/lib/hooks/use-get-signatures";
import { useSignPdf } from "@/lib/hooks/use-sign-pdf";
import { FileSignature, CheckCircle2, AlertCircle } from "lucide-react";

interface Step3AddSignatureProps {
  documentId: string;
  documentPdf: DocumentPdfResponse | null;
  signatureImage: string | null;
  setSignatureImage: React.Dispatch<React.SetStateAction<string | null>>;
  signatureData: Step3bFormData | null;
  setSignatureData: React.Dispatch<React.SetStateAction<Step3bFormData | null>>;
  signaturePosition: SignaturePosition;
  setSignaturePosition: React.Dispatch<React.SetStateAction<SignaturePosition>>;
  signatureHistory: string[];
  setSignatureHistory: React.Dispatch<React.SetStateAction<string[]>>;
  onPdfSigned?: (signedPdfUrl: string) => void;
  onProceedToStep4?: () => void;
}

export default function Step3AddSignature({
  documentId,
  documentPdf,
  signatureImage,
  setSignatureImage,
  signatureData,
  setSignatureData,
  signaturePosition,
  setSignaturePosition,
  signatureHistory,
  setSignatureHistory,
  onPdfSigned,
  onProceedToStep4,
}: Step3AddSignatureProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step3bFormData>({
    mode: "onBlur",
  });

  // Watch individual form fields for stable dependencies
  const organization = watch("organization");
  const signerName = watch("signerName");
  const position = watch("position");

  // PDF rendering state
  const [pdfScale, setPdfScale] = useState<number>(PDF_SCALE);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // PDF signing state
  const [isSigningPdf, setIsSigningPdf] = useState<boolean>(false);
  const [signPdfError, setSignPdfError] = useState<string | null>(null);
  const [isPdfSigned, setIsPdfSigned] = useState<boolean>(false);

  // Visual position for display (separate from canvas pixel position for PDF)
  const [visualPosition, setVisualPosition] = useState<CanvasPosition>({
    x: 0,
    y: 0,
  });

  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Use sign PDF mutation
  const { mutate: signPdf } = useSignPdf();

  // Auto-generate signature when all fields are selected
  useEffect(() => {
    if (organization && signerName && position) {
      const data: Step3bFormData = {
        organization,
        signerName,
        position,
      };
      const image = generateSignatureImage(data);
      setSignatureImage(image);
      setSignatureData(data);

      // Only add to history if it's a new signature (not same as last one)
      setSignatureHistory((prev) => {
        const lastSignature = prev[prev.length - 1];
        if (lastSignature !== JSON.stringify(data)) {
          return [...prev, JSON.stringify(data)];
        }
        return prev;
      });
    } else {
      setSignatureImage(null);
      setSignatureData(null);
    }
  }, [
    organization,
    signerName,
    position,
    setSignatureImage,
    setSignatureData,
    setSignatureHistory,
  ]);

  // Fetch existing signatures
  const { data: signatures, isLoading: isLoadingSignatures } = useGetSignatures(
    {
      documentId,
    }
  );

  // Load most recent signature when component mounts or signatures change
  useEffect(() => {
    // Only load signature if:
    // 1. We have signatures data
    // 2. We don't already have signature data (this is initial load)
    // 3. Signatures array is not empty
    if (
      signatures &&
      signatures.length > 0 &&
      !signatureData &&
      !signatureImage
    ) {
      const mostRecentSignature = signatures[0]; // Most recent is first in array

      // Populate form fields with signature data
      setValue("organization", mostRecentSignature.organization || "");
      setValue("signerName", mostRecentSignature.signerName);
      setValue("position", mostRecentSignature.signerPosition || "");

      // Set signature data and image
      const loadedSignatureData: Step3bFormData = {
        organization: mostRecentSignature.organization || "",
        signerName: mostRecentSignature.signerName,
        position: mostRecentSignature.signerPosition || "",
      };
      setSignatureData(loadedSignatureData);
      setSignatureImage(mostRecentSignature.publicUrl);

      // Use canvas coordinates directly if available (no conversion needed)
      if (
        mostRecentSignature.canvasPosX !== null &&
        mostRecentSignature.canvasPosY !== null
      ) {
        setSignaturePosition({
          x: mostRecentSignature.canvasPosX,
          y: mostRecentSignature.canvasPosY,
          page: mostRecentSignature.pageNumber,
        });

        // Convert canvas pixel position to visual position for display
        if (containerRef.current) {
          const canvas = containerRef.current.querySelector(
            "canvas"
          ) as HTMLCanvasElement | null;

          if (canvas) {
            const scaleX = canvas.getBoundingClientRect().width / canvas.width;
            const scaleY =
              canvas.getBoundingClientRect().height / canvas.height;
            setVisualPosition({
              x: mostRecentSignature.canvasPosX * scaleX,
              y: mostRecentSignature.canvasPosY * scaleY,
            });
          }
        }
      } else {
        // Fallback: Convert PDF coordinates to canvas coordinates
        // (for existing signatures that don't have canvas coordinates)
        if (containerRef.current) {
          const canvas = containerRef.current.querySelector(
            "canvas"
          ) as HTMLCanvasElement | null;

          if (canvas) {
            try {
              const canvasPosition = convertPdfToCanvasCoordinates(
                {
                  x: mostRecentSignature.posX,
                  y: mostRecentSignature.posY,
                  width: mostRecentSignature.width,
                  height: mostRecentSignature.height,
                },
                canvas,
                pdfScale
              );

              setSignaturePosition({
                x: canvasPosition.x,
                y: canvasPosition.y,
                page: mostRecentSignature.pageNumber,
              });

              // Convert canvas pixel position to visual position for display
              const scaleX =
                canvas.getBoundingClientRect().width / canvas.width;
              const scaleY =
                canvas.getBoundingClientRect().height / canvas.height;
              setVisualPosition({
                x: canvasPosition.x * scaleX,
                y: canvasPosition.y * scaleY,
              });
            } catch (error) {
              console.error(
                "Error converting PDF coordinates to canvas:",
                error
              );
              // Set default position if conversion fails
              setSignaturePosition({ x: 0, y: 0, page: 1 });
              setVisualPosition({ x: 0, y: 0 });
            }
          }
        }
      }
    }
  }, [signatures, signatureData, signatureImage, setValue, pdfScale]);

  // Handle signature drag
  const handleSignatureDrag = (x: number, y: number) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const canvas = containerRef.current.querySelector(
      "canvas"
    ) as HTMLCanvasElement | null;

    if (canvas) {
      // Calculate scale factor from visual space to canvas pixel space
      const scaleX = canvas.width / canvas.getBoundingClientRect().width;
      const scaleY = canvas.height / canvas.getBoundingClientRect().height;

      // Clamp position in visual space
      const clampedPosition = clampPosition(
        { x, y },
        containerRect.width,
        containerRect.height,
        SIGNATURE_IMAGE_WIDTH,
        SIGNATURE_IMAGE_HEIGHT
      );

      // Scale from visual space to canvas pixel space
      const scaledPosition = {
        x: clampedPosition.x * scaleX,
        y: clampedPosition.y * scaleY,
      };

      // Store both visual position (for display) and canvas pixel position (for PDF)
      setVisualPosition(clampedPosition);
      setSignaturePosition({
        x: scaledPosition.x,
        y: scaledPosition.y,
        page: 1,
      });
    }
  };

  // Clear form
  const clearSignature = () => {
    setSignatureImage(null);
    setSignatureData(null);
  };

  // Save signature to database
  const handleSaveSignature = async () => {
    if (!signatureData || !signatureImage || !documentPdf) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      // Get canvas from container ref
      const canvas = containerRef.current?.querySelector(
        "canvas"
      ) as HTMLCanvasElement | null;

      // Convert canvas coordinates to PDF coordinates
      if (!canvas) {
        throw new Error("PDF canvas not found");
      }

      const pdfPosition = convertCanvasToPdfCoordinates(
        { x: signaturePosition.x, y: signaturePosition.y },
        canvas,
        pdfScale,
        { width: SIGNATURE_IMAGE_WIDTH, height: SIGNATURE_IMAGE_HEIGHT }
      );

      const response = await fetch(`/api/documents/${documentId}/signature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          documentPdfId: documentPdf.id,
          signatureData,
          signaturePosition: {
            x: pdfPosition.x, // PDF coordinates for embedding
            y: pdfPosition.y, // PDF coordinates for embedding
            width: pdfPosition.width, // PDF width for embedding
            height: pdfPosition.height, // PDF height for embedding
            page: signaturePosition.page,
          },
          canvasPosition: {
            // Canvas coordinates for display
            x: signaturePosition.x,
            y: signaturePosition.y,
          },
          signatureImage,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save signature");
      }
    } catch (error) {
      console.error("Error saving signature:", error);
      setSaveError(
        error instanceof Error ? error.message : "Failed to save signature"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Sign PDF with embedded signature
  const handleSignPdf = async () => {
    if (!signatureData || !signatureImage || !documentPdf) return;

    setIsSigningPdf(true);
    setSignPdfError(null);

    try {
      // Get canvas from container ref
      const canvas = containerRef.current?.querySelector(
        "canvas"
      ) as HTMLCanvasElement | null;

      if (!canvas) {
        throw new Error("PDF canvas not found");
      }

      // Convert canvas coordinates to PDF coordinates
      const pdfPosition = convertCanvasToPdfCoordinates(
        { x: signaturePosition.x, y: signaturePosition.y },
        canvas,
        pdfScale,
        { width: SIGNATURE_IMAGE_WIDTH, height: SIGNATURE_IMAGE_HEIGHT }
      );

      // Sign PDF with embedded signature
      await signPdf({
        documentId,
        documentPdfId: documentPdf.id,
        signatureImage,
        position: {
          x: pdfPosition.x,
          y: pdfPosition.y,
          width: pdfPosition.width,
          height: pdfPosition.height,
        },
      });

      // Update state to show PDF is signed
      setIsPdfSigned(true);

      // Note: The signed PDF URL will be updated via the onSuccess callback in the hook
      // which invalidates document queries and triggers a refetch

      // Auto-proceed to Step 4 after short delay
      setTimeout(() => {
        if (onProceedToStep4) {
          onProceedToStep4();
        }
      }, 1500);
    } catch (error) {
      console.error("Error signing PDF:", error);
      setSignPdfError(
        error instanceof Error ? error.message : "Failed to sign PDF"
      );
    } finally {
      setIsSigningPdf(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoadingSignatures && (
            <div className="flex items-center justify-center py-8 text-neutral-500">
              <svg
                className="animate-spin h-6 w-6 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading signature...
            </div>
          )}
          <SignatureForm
            register={register}
            errors={errors}
            signatureData={signatureData}
            signatureImage={signatureImage}
            onClearForm={clearSignature}
          />
          <SignaturePreview
            signatureData={signatureData}
            signatureImage={signatureImage}
          />
          <SignatureStatus signatureImage={signatureImage} />
          <SignatureSaveButton
            signatureImage={signatureImage}
            isSaving={isSaving}
            onSave={handleSaveSignature}
            saveError={saveError}
          />

          {/* PDF Signing Section */}
          {signatureImage && (
            <div className="space-y-4">
              {/* Sign PDF Button */}
              <Button
                type="button"
                onClick={handleSignPdf}
                disabled={isSigningPdf || isPdfSigned}
                className="w-full"
                size="lg"
              >
                {isSigningPdf ? (
                  <>
                    <svg
                      className="mr-2 h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing PDF...
                  </>
                ) : isPdfSigned ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    PDF Signed
                  </>
                ) : (
                  <>
                    <FileSignature className="mr-2 h-5 w-5" />
                    Sign PDF
                  </>
                )}
              </Button>

              {/* Success Message */}
              {isPdfSigned && !isSigningPdf && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900 dark:text-green-100">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      PDF Signed Successfully!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your document has been signed and is ready for final
                      review. Proceeding to Step 4...
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {signPdfError && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-950 dark:text-red-100">
                  <AlertCircle className="h-6 w-6 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Failed to Sign PDF</p>
                    <p className="text-xs text-red-600 dark:text-red-300">
                      {signPdfError}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <PdfPreviewPanel
        documentPdf={documentPdf}
        signatureImage={signatureImage}
        signaturePosition={visualPosition}
        onSignatureDrag={handleSignatureDrag}
        containerRef={containerRef}
        onPdfScaleChange={setPdfScale}
      />
    </div>
  );
}
