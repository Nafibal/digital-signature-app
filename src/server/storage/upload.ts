/**
 * Supabase Storage Upload Utilities
 *
 * Server-side utilities for uploading and managing files in Supabase Storage
 */

import { supabase } from "./supabase";

export interface UploadResult {
  path: string;
  fullPath: string;
  fileName: string;
  fileSize: number;
}

export interface UploadError {
  message: string;
  code?: string;
}

/**
 * Upload a PDF file to Supabase Storage
 * @param file - PDF file to upload
 * @param userId - User ID for folder organization
 * @returns Upload result with file path
 * @throws Error if upload fails or validation fails
 */
export async function uploadPDF(
  file: File,
  userId: string
): Promise<UploadResult> {
  // Validate file type
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error("File size exceeds 10MB limit");
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileName = `${timestamp}-${randomString}-${file.name}`;

  // Create folder path: documents/{userId}/{fileName}
  const filePath = `${userId}/${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("documents")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  return {
    path: filePath,
    fullPath: data.path,
    fileName: file.name,
    fileSize: file.size,
  };
}

/**
 * Get public URL for a file
 * @param path - File path in storage
 * @returns Public URL for file
 */
export async function getPublicUrl(path: string): Promise<string> {
  const { data } = supabase.storage.from("documents").getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage
 * @param path - File path to delete
 * @throws Error if deletion fails
 */
export async function deleteFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from("documents").remove([path]);

  if (error) {
    console.error("Delete error:", error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}
