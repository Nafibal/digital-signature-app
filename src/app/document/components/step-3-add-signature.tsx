"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  SignaturePosition,
  Step3bFormData,
  DEFAULT_ORGANIZATIONS,
  DocumentPdfResponse,
  CanvasPosition,
} from "@/lib/types/document";
import {
  generateSignatureImage,
  SIGNATURE_IMAGE_WIDTH,
  SIGNATURE_IMAGE_HEIGHT,
} from "@/lib/utils/signature";
import { loadPdfDocument, renderPdfPage, PDF_SCALE } from "@/lib/utils/pdf";
import {
  convertCanvasToPdfCoordinates,
  clampPosition,
} from "@/lib/utils/coordinates";
import { DraggableSignature } from "@/components/pdf";

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
  onSignatureSaved?: () => void;
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
  onSignatureSaved,
}: Step3AddSignatureProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<Step3bFormData>({
    mode: "onBlur",
  });

  // Watch all form values
  const watchedValues = watch();

  // PDF rendering state
  const [pdfScale, setPdfScale] = useState<number>(PDF_SCALE);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-generate signature when all fields are selected
  useEffect(() => {
    if (
      watchedValues.organization &&
      watchedValues.signerName &&
      watchedValues.position
    ) {
      const data: Step3bFormData = {
        organization: watchedValues.organization,
        signerName: watchedValues.signerName,
        position: watchedValues.position,
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
  }, [watchedValues, setSignatureImage, setSignatureData, setSignatureHistory]);

  // Load and render PDF when documentPdf is available
  useEffect(() => {
    if (documentPdf) {
      // Use setTimeout to ensure canvas is mounted to DOM
      const timer = setTimeout(() => {
        if (canvasRef.current) {
          loadAndRenderPdf();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [documentPdf]);

  const loadAndRenderPdf = async () => {
    // Capture canvas value to avoid race condition
    const canvas = canvasRef.current;

    if (!documentPdf || !canvas) {
      console.warn("Cannot load PDF: missing documentPdf or canvas");
      return;
    }

    setIsPdfLoading(true);
    setPdfError(null);

    try {
      const pdfDoc = await loadPdfDocument(documentPdf.publicUrl);
      const scale = await renderPdfPage(pdfDoc, 1, canvas);
      setPdfScale(scale);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setPdfError("Failed to load PDF. Please try again.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  // Handle signature drag
  const handleSignatureDrag = (x: number, y: number) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const clampedPosition = clampPosition(
      { x, y },
      containerRect.width,
      containerRect.height,
      SIGNATURE_IMAGE_WIDTH,
      SIGNATURE_IMAGE_HEIGHT
    );

    setSignaturePosition({
      x: clampedPosition.x,
      y: clampedPosition.y,
      page: 1,
    });
  };

  // Clear form
  const clearSignature = () => {
    setSignatureImage(null);
    setSignatureData(null);
  };

  // Save signature to database
  const handleSaveSignature = async () => {
    if (!signatureData || !signatureImage || !documentPdf) return;

    // Capture canvas value to avoid race condition
    const canvas = canvasRef.current;

    setIsSaving(true);
    setSaveError(null);

    try {
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
            x: pdfPosition.x,
            y: pdfPosition.y,
            page: signaturePosition.page,
          },
          signatureImage,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save signature");
      }

      // Notify parent component
      if (onSignatureSaved) {
        onSignatureSaved();
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

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Signature Form Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Create Signature</CardTitle>
          <CardDescription>
            Select signer details to create your signature
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Signature Form */}
          <div className="space-y-4">
            {/* Organization/Unit Select */}
            <div className="space-y-2">
              <label
                htmlFor="organization"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Organization / Unit
              </label>
              <select
                id="organization"
                {...register("organization", {
                  required: "Organization is required",
                })}
                aria-invalid={errors.organization ? "true" : "false"}
                className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              >
                <option value="">Select organization...</option>
                {DEFAULT_ORGANIZATIONS.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
              <p className="text-sm text-neutral-500">
                Choose department or unit for this signature
              </p>
              {errors.organization && (
                <p className="text-sm text-red-500">
                  {errors.organization.message}
                </p>
              )}
            </div>

            {/* Signer Name Input */}
            <div className="space-y-2">
              <label
                htmlFor="signerName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Signer Name
              </label>
              <input
                id="signerName"
                type="text"
                placeholder="Enter signer name..."
                {...register("signerName", {
                  required: "Signer name is required",
                })}
                aria-invalid={errors.signerName ? "true" : "false"}
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-sm text-neutral-500">
                Enter the full name of person who will sign the document
              </p>
              {errors.signerName && (
                <p className="text-sm text-red-500">
                  {errors.signerName.message}
                </p>
              )}
            </div>

            {/* Position Input */}
            <div className="space-y-2">
              <label
                htmlFor="position"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Position
              </label>
              <input
                id="position"
                type="text"
                placeholder="Enter position..."
                {...register("position", {
                  required: "Position is required",
                })}
                aria-invalid={errors.position ? "true" : "false"}
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-sm text-neutral-500">
                Enter the job title or position of signer
              </p>
              {errors.position && (
                <p className="text-sm text-red-500">
                  {errors.position.message}
                </p>
              )}
            </div>

            {/* Clear Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSignature}
              disabled={!signatureImage}
              className="w-full"
            >
              Clear Form
            </Button>
          </div>

          {/* Signature Preview */}
          {signatureData && signatureImage && (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <p className="mb-2 text-sm font-medium text-neutral-700">
                Signature Preview:
              </p>
              <img
                src={signatureImage}
                alt="Signature preview"
                className="w-full rounded border border-neutral-300"
              />
            </div>
          )}

          {/* Signature Status */}
          <div
            className={`flex items-center gap-3 rounded-lg border p-4 ${
              signatureImage
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-neutral-200 bg-neutral-50 text-neutral-600"
            }`}
          >
            {signatureImage ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-neutral-300" />
            )}
            <div className="text-sm">
              {signatureImage ? (
                <span>
                  Signature created. Drag it to position on the PDF, then click
                  Save Signature.
                </span>
              ) : (
                <span>
                  Please fill in all three fields to create your signature.
                </span>
              )}
            </div>
          </div>

          {/* Save Button */}
          {signatureImage && (
            <Button
              type="button"
              onClick={handleSaveSignature}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Signature"
              )}
            </Button>
          )}

          {/* Save Error */}
          {saveError && <p className="text-sm text-red-500">{saveError}</p>}
        </CardContent>
      </Card>

      {/* PDF Preview Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Place Signature</CardTitle>
          <CardDescription>
            Drag signature to desired position on document
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* PDF Preview */}
          <div
            ref={containerRef}
            data-signature-container="true"
            className="relative min-h-[600px] overflow-hidden rounded-lg border border-neutral-200 bg-white"
          >
            {isPdfLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
              </div>
            ) : pdfError ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-red-500">{pdfError}</p>
              </div>
            ) : documentPdf ? (
              <>
                <canvas ref={canvasRef} className="w-full" />
                {signatureImage && (
                  <DraggableSignature
                    signatureImage={signatureImage}
                    position={{
                      x: signaturePosition.x,
                      y: signaturePosition.y,
                    }}
                    onDrag={handleSignatureDrag}
                    containerRef={containerRef}
                    width={SIGNATURE_IMAGE_WIDTH}
                    height={SIGNATURE_IMAGE_HEIGHT}
                  />
                )}
              </>
            ) : (
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
          </div>

          {/* Position Info */}
          {signatureImage && (
            <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-sm text-neutral-600">
                <span className="font-medium">Position:</span> X:{" "}
                {Math.round(signaturePosition.x)}, Y:{" "}
                {Math.round(signaturePosition.y)}, Page:{" "}
                {signaturePosition.page}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
