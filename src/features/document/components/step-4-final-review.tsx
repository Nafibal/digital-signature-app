"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Step1FormData, SignaturePosition } from "@/features/document/types";
import { GetDocumentResponse } from "@/features/document/services";
import { getPdfUrlFromDocumentPdf } from "@/features/document/utils/pdf-url";
import DocumentSummary from "./step-4-final-review/DocumentSummary";
import SignedPdfPreview from "./step-4-final-review/SignedPdfPreview";

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
  // Extract signed PDF URL using utility function (single source of truth)
  const finalPdfUrl = getPdfUrlFromDocumentPdf(
    documentDataFetched?.signedPdf || null,
    documentDataFetched?.id || ""
  );
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
