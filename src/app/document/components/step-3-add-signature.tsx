"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  clampPosition,
} from "@/lib/utils/coordinates";
import SignatureForm from "./step-3-add-signature/signature-form";
import SignaturePreview from "./step-3-add-signature/signature-preview";
import SignatureStatus from "./step-3-add-signature/signature-status";
import SignatureSaveButton from "./step-3-add-signature/signature-save-button";
import PdfPreviewPanel from "./step-3-add-signature/pdf-preview-panel";

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

  // Watch individual form fields for stable dependencies
  const organization = watch("organization");
  const signerName = watch("signerName");
  const position = watch("position");

  // PDF rendering state
  const [pdfScale, setPdfScale] = useState<number>(PDF_SCALE);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      <Card>
        <CardHeader>
          <CardTitle>Create Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>

      <PdfPreviewPanel
        documentPdf={documentPdf}
        signatureImage={signatureImage}
        signaturePosition={signaturePosition}
        onSignatureDrag={handleSignatureDrag}
        containerRef={containerRef}
        onPdfScaleChange={setPdfScale}
      />
    </div>
  );
}
