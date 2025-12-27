"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";

interface Step2UploadProps {
  uploadMode: "upload" | "create";
  setUploadMode: React.Dispatch<React.SetStateAction<"upload" | "create">>;
  uploadedFile: File | null;
  setUploadedFile: React.Dispatch<React.SetStateAction<File | null>>;
  documentId: string | null;
  onNext: () => void;
}

export default function Step2Upload({
  uploadMode,
  setUploadMode,
  uploadedFile,
  setUploadedFile,
  documentId,
  onNext,
}: Step2UploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    // Mock upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload or Create Document</CardTitle>
        <CardDescription>
          Upload an existing PDF document or create a new one from scratch
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Tab Switcher */}
        <div className="mb-6 flex gap-2 border-b">
          <button
            type="button"
            onClick={() => setUploadMode("upload")}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              uploadMode === "upload"
                ? "border-b-2 border-neutral-950 text-neutral-950"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Upload PDF
          </button>
          <button
            type="button"
            onClick={() => setUploadMode("create")}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              uploadMode === "create"
                ? "border-b-2 border-neutral-950 text-neutral-950"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Create New
          </button>
        </div>

        {/* Upload Tab Content */}
        {uploadMode === "upload" && (
          <div className="space-y-6">
            {!uploadedFile ? (
              /* Upload Zone */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
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
                <p className="mt-4 text-xs text-neutral-400">
                  Maximum file size: 10MB
                </p>
              </div>
            ) : (
              /* File Preview */
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                  {uploadProgress < 100 ? (
                    <div className="text-sm text-neutral-500">
                      {uploadProgress}%
                    </div>
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
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
            )}
          </div>
        )}

        {/* Create Tab Content */}
        {uploadMode === "create" && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                <FileText className="h-8 w-8 text-neutral-600" />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-neutral-900">
                  Start from Scratch
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  Create a new document from scratch. You&apos;ll fill in the
                  content in the next step.
                </p>
              </div>
              <CheckCircle2 className="mt-4 h-6 w-6 text-green-600" />
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You&apos;ll be able to add your document
                content and signature in the next step. A live PDF preview will
                be generated as you edit.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
