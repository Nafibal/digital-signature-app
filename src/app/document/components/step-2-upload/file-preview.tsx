/**
 * FilePreview Component
 *
 * Displays uploaded file preview with progress bar for Step 2.
 * Extracted from step-2-upload.tsx for better organization and testability.
 */

import { Button } from "@/components/ui/button";
import { FileText, X, CheckCircle2 } from "lucide-react";

interface FilePreviewProps {
  uploadedFile: File | null;
  uploadProgress: number;
  onRemoveFile: () => void;
  formatFileSize: (bytes: number) => string;
}

export function FilePreview({
  uploadedFile,
  uploadProgress,
  onRemoveFile,
  formatFileSize,
}: FilePreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
          <FileText className="h-6 w-6 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-900">
            {uploadedFile?.name}
          </p>
          <p className="text-xs text-neutral-500">
            {uploadedFile ? formatFileSize(uploadedFile.size) : ""}
          </p>
        </div>
        {uploadProgress < 100 ? (
          <div className="text-sm text-neutral-500">{uploadProgress}%</div>
        ) : (
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemoveFile}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {uploadProgress < 100 && (
        <div className="space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full bg-neutral-950 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500">Uploading...</p>
        </div>
      )}
    </div>
  );
}
