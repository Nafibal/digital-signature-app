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
import { TabSwitcher } from "./step-2-upload/TabSwitcher";
import { UploadZone } from "./step-2-upload/UploadZone";
import { FilePreview } from "./step-2-upload/FilePreview";
import { CreateMode } from "./step-2-upload/CreateMode";

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
        <TabSwitcher uploadMode={uploadMode} setUploadMode={setUploadMode} />

        {/* Upload Tab Content */}
        {uploadMode === "upload" && (
          <div className="space-y-6">
            {!uploadedFile ? (
              <UploadZone
                isDragging={isDragging}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFileSelect={handleFileSelect}
              />
            ) : (
              <FilePreview
                uploadedFile={uploadedFile}
                uploadProgress={uploadProgress}
                onRemoveFile={handleRemoveFile}
                formatFileSize={formatFileSize}
              />
            )}
          </div>
        )}

        {/* Create Tab Content */}
        {uploadMode === "create" && <CreateMode />}
      </CardContent>
    </Card>
  );
}
