"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2 } from "lucide-react";
import { Step1FormData, SignaturePosition } from "@/lib/types/document";
import DocumentSummary from "./step-4-final-review/document-summary";
import PdfPreviewSection from "./step-4-final-review/pdf-preview-section";
import SignaturePreview from "./step-4-final-review/signature-preview";
import CompletionChecklist from "./step-4-final-review/completion-checklist";

interface Step4FinalReviewProps {
  documentData: Step1FormData;
  signature: string | null;
  signaturePosition: SignaturePosition;
  finalPdfUrl: string;
}

export default function Step4FinalReview({
  documentData,
  signature,
  signaturePosition,
  finalPdfUrl,
}: Step4FinalReviewProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownload = () => {
    if (!finalPdfUrl || finalPdfUrl.length === 0) {
      console.error("No signed PDF available for download");
      return;
    }

    // Create download link
    const link = document.createElement("a");
    link.href = finalPdfUrl;
    link.download = `signed-document-${Date.now()}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <DocumentSummary documentData={documentData} currentDate={currentDate} />

      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Final Review</CardTitle>
              <CardDescription>Preview your signed document</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!finalPdfUrl || finalPdfUrl.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <PdfPreviewSection
            signature={signature}
            signaturePosition={signaturePosition}
            finalPdfUrl={finalPdfUrl}
            onDownload={handleDownload}
          />
          <SignaturePreview
            signature={signature}
            signaturePosition={signaturePosition}
          />
          <CompletionChecklist finalPdfUrl={finalPdfUrl} />
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-green-900">
                Ready to Save
              </p>
              <p className="text-sm text-green-700">
                Your document is ready to be saved as a signed PDF
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
