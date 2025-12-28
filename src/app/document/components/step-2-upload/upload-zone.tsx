/**
 * UploadZone Component
 *
 * Displays drag-and-drop upload zone for Step 2.
 * Extracted from step-2-upload.tsx for better organization and testability.
 */

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (file: File) => void;
}

export function UploadZone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}: UploadZoneProps) {
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
        isDragging
          ? "border-neutral-950 bg-neutral-50"
          : "border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50"
      }`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
        <Upload className="h-8 w-8 text-neutral-600" />
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm font-medium text-neutral-900">
          Drag and drop your PDF here
        </p>
        <p className="mt-1 text-sm text-neutral-500">or</p>
      </div>
      <label className="mt-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />
        <Button type="button" variant="outline" asChild>
          <span>Browse Files</span>
        </Button>
      </label>
      <p className="mt-4 text-xs text-neutral-400">Maximum file size: 10MB</p>
    </div>
  );
}
