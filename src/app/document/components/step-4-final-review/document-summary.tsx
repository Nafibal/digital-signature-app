import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Step1FormData, DOCUMENT_TYPE_LABELS } from "@/lib/types/document";

interface DocumentSummaryProps {
  documentData: Step1FormData;
  currentDate: string;
}

export default function DocumentSummary({
  documentData,
  currentDate,
}: DocumentSummaryProps) {
  const documentTypeLabels = DOCUMENT_TYPE_LABELS;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Summary</CardTitle>
        <CardDescription>Review document details before saving</CardDescription>
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
            <p className="text-sm font-medium text-neutral-500">Description</p>
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
  );
}
