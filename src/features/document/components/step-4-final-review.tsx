"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Step1FormData, SignaturePosition } from "@/lib/types/document";
import { GetDocumentResponse } from "@/lib/api/documents";
import DocumentSummary from "./step-4-final-review/document-summary";
import SignedPdfPreview from "./step-4-final-review/signed-pdf-preview";

interface Step4FinalReviewProps {
  documentData: Step1FormData;
  signature: string | null;
  signaturePosition: SignaturePosition;
  documentDataFetched?: GetDocumentResponse | null;
}

export default function Step4FinalReview({
  documentData,
  signature,
  signaturePosition,
  documentDataFetched,
}: Step4FinalReviewProps) {
  // Extract signed PDF URL from database data (single source of truth)
  const finalPdfUrl = documentDataFetched?.signedPdf?.publicUrl || "";
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DocumentSummary documentData={documentData} currentDate={currentDate} />

      <SignedPdfPreview finalPdfUrl={finalPdfUrl} />
    </div>
  );
}
