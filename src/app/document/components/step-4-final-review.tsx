"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, CheckCircle2, Calendar, User } from "lucide-react";
import {
  Step1FormData,
  SignaturePosition,
  DOCUMENT_TYPE_LABELS,
} from "@/lib/types/document";

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
  const documentTypeLabels = DOCUMENT_TYPE_LABELS;

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownload = () => {
    // Mock download functionality
    console.log("Downloading PDF...");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Document Summary */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Document Summary</CardTitle>
          <CardDescription>
            Review document details before saving
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Document Title */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-neutral-500">Title</p>
            <p className="text-base font-semibold text-neutral-900">
              {documentData.title || "Untitled Document"}
            </p>
          </div>

          {/* Document Type */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-neutral-500">Type</p>
            <p className="text-base text-neutral-900">
              {documentTypeLabels[documentData.documentType] ||
                documentData.documentType}
            </p>
          </div>

          {/* Description */}
          {documentData.description && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-neutral-500">
                Description
              </p>
              <p className="text-sm text-neutral-700">
                {documentData.description}
              </p>
            </div>
          )}

          {/* Created Date */}
          <div className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <Calendar className="mt-0.5 h-5 w-5 text-neutral-600" />
            <div>
              <p className="text-sm font-medium text-neutral-900">Created</p>
              <p className="text-sm text-neutral-600">{currentDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final PDF Preview */}
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
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PDF Preview Placeholder */}
          <div className="relative rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-neutral-400">
              <FileText className="h-24 w-24" />
              <div className="text-center">
                <p className="text-lg font-medium">Final PDF Preview</p>
                <p className="text-sm">Your signed document will appear here</p>
              </div>
            </div>

            {/* Signature Placement Indicator */}
            {signature && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-50 p-2 shadow-md"
                style={{
                  left: `${signaturePosition.x}px`,
                  top: `${signaturePosition.y}px`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <img src={signature} alt="Signature" className="h-16 w-auto" />
              </div>
            )}
          </div>

          {/* Signature Preview */}
          {signature && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900">
                    Signature Added
                  </p>
                  <p className="mt-1 text-sm text-green-700">
                    Your signature has been successfully placed on the document
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-green-600">Position:</span>
                    <span className="text-xs font-medium text-green-800">
                      X: {Math.round(signaturePosition.x)}, Y:{" "}
                      {Math.round(signaturePosition.y)}, Page:{" "}
                      {signaturePosition.page}
                    </span>
                  </div>
                </div>
                <img
                  src={signature}
                  alt="Signature Preview"
                  className="h-16 w-auto rounded border border-green-200 bg-white p-2"
                />
              </div>
            </div>
          )}

          {/* Completion Checklist */}
          <div className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <p className="text-sm font-semibold text-neutral-900">
              Review Checklist
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm text-neutral-700">
                  Document content reviewed
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm text-neutral-700">
                  Signature captured and positioned
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm text-neutral-700">
                  All details verified
                </span>
              </div>
            </div>
          </div>

          {/* Ready to Save */}
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
