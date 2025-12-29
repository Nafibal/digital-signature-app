/**
 * Helper Functions
 *
 * General utility functions for the application
 */

// ============================================================================
// Coordinate Conversion Utilities
// ============================================================================

/**
 * Canvas position
 * Coordinates for signature on canvas preview (top-left origin)
 */
export interface CanvasPosition {
  x: number;
  y: number;
}

/**
 * PDF position
 * Coordinates for embedding signature in PDF (bottom-left origin)
 */
export interface PdfPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  page?: number;
}

/**
 * Signature size
 * Dimensions of signature image
 */
export interface SignatureSize {
  width: number;
  height: number;
}

// PDF scale factor for better rendering quality
export const PDF_SCALE = 1.5;

/**
 * Convert canvas coordinates to PDF coordinates
 *
 * Canvas coordinates: Rendered at scale factor (e.g., 1.5x), origin at top-left
 * PDF coordinates: Native 1.0x scale, origin at bottom-left
 *
 * Conversion formula:
 * - pdfX = canvasX / scale
 * - pdfY = (canvasHeight / scale) - (canvasY / scale) - (signatureHeight / scale)
 * - pdfWidth = signatureWidth * scale
 * - pdfHeight = signatureHeight * scale
 *
 * Note: Signature dimensions ARE scaled by scale factor because:
 * - The signature is displayed at CSS pixels on canvas (e.g., 400×150px)
 * - The canvas is scaled up for display quality (e.g., 1.5x)
 * - To match the visual size in PDF, we need to scale dimensions by same factor
 * - Position coordinates are divided by scale (canvas → PDF)
 * - Signature dimensions are multiplied by scale (CSS pixels → PDF points)
 *
 * @param canvasPosition - Position on canvas (x, y)
 * @param canvas - HTMLCanvasElement to get dimensions
 * @param scale - Scale factor used for rendering (default: PDF_SCALE)
 * @param signatureSize - Signature dimensions (width, height)
 * @returns PDF position coordinates (x, y, width, height)
 */
export function convertCanvasToPdfCoordinates(
  canvasPosition: CanvasPosition,
  canvas: HTMLCanvasElement,
  scale: number = PDF_SCALE,
  signatureSize: SignatureSize = { width: 400, height: 150 }
): PdfPosition {
  const canvasHeight = canvas.height;
  const canvasWidth = canvas.width;

  // Convert canvas coordinates to PDF coordinates
  const pdfX = canvasPosition.x / scale;
  const pdfY =
    canvasHeight / scale -
    canvasPosition.y / scale -
    signatureSize.height / scale;

  const pdfWidth = 400 / scale;
  const pdfHeight = 150 / scale;

  return {
    x: pdfX,
    y: pdfY,
    width: pdfWidth,
    height: pdfHeight,
  };
}

/**
 * Convert PDF coordinates to canvas coordinates
 *
 * Reverse of convertCanvasToPdfCoordinates
 *
 * @param pdfPosition - Position in PDF (x, y, width, height)
 * @param canvas - HTMLCanvasElement to get dimensions
 * @param scale - Scale factor used for rendering (default: PDF_SCALE)
 * @returns Canvas position coordinates (x, y)
 */
export function convertPdfToCanvasCoordinates(
  pdfPosition: PdfPosition,
  canvas: HTMLCanvasElement,
  scale: number = PDF_SCALE
): CanvasPosition {
  const canvasHeight = canvas.height;

  // Convert PDF coordinates to canvas coordinates
  const canvasX = pdfPosition.x * scale;
  const canvasY =
    canvasHeight - pdfPosition.y * scale - pdfPosition.height * scale;

  return {
    x: canvasX,
    y: canvasY,
  };
}

/**
 * Clamp position within container bounds
 *
 * Ensures signature stays within PDF canvas boundaries
 *
 * @param position - Position to clamp (x, y)
 * @param containerWidth - Container width
 * @param containerHeight - Container height
 * @param signatureWidth - Signature width
 * @param signatureHeight - Signature height
 * @returns Clamped position (x, y)
 */
export function clampPosition(
  position: CanvasPosition,
  containerWidth: number,
  containerHeight: number,
  signatureWidth: number,
  signatureHeight: number
): CanvasPosition {
  const maxX = containerWidth - signatureWidth;
  const maxY = containerHeight - signatureHeight;

  return {
    x: Math.max(0, Math.min(position.x, maxX)),
    y: Math.max(0, Math.min(position.y, maxY)),
  };
}

/**
 * Calculate signature position relative to container
 *
 * @param clientX - Mouse client X coordinate
 * @param clientY - Mouse client Y coordinate
 * @param containerRect - Container bounding rectangle
 * @param offsetX - Offset from signature top-left corner
 * @param offsetY - Offset from signature top-left corner
 * @returns Relative position (x, y)
 */
export function calculateRelativePosition(
  clientX: number,
  clientY: number,
  containerRect: DOMRect,
  offsetX: number,
  offsetY: number
): CanvasPosition {
  const x = clientX - containerRect.left - offsetX;
  const y = clientY - containerRect.top - offsetY;

  return { x, y };
}

// ============================================================================
// Signature Image Generation Utility
// ============================================================================

import { Step3bFormData } from "@/features/document/types";

// ============================================================================
// PDF Rendering Utilities
// ============================================================================

/**
 * Type for PDF.js document proxy
 * Using unknown to avoid type conflicts with pdfjs-dist types
 */
export type PdfDocument = unknown;

/**
 * Type for PDF.js page proxy
 * Using unknown to avoid type conflicts with pdfjs-dist types
 */
export type PdfPage = unknown;

/**
 * Type for PDF.js viewport
 * Using unknown to avoid type conflicts with pdfjs-dist types
 */
export type PdfViewport = unknown;

// Worker configuration state
let isWorkerConfigured = false;

/**
 * Load PDF document from URL
 *
 * Configures PDF.js worker on client-side only and loads PDF document
 *
 * @param pdfUrl - URL or path to PDF document
 * @returns PDF document object
 */
export async function loadPdfDocument(pdfUrl: string) {
  // Validate URL
  if (!pdfUrl || typeof pdfUrl !== "string") {
    throw new Error("Invalid PDF URL provided");
  }

  // Configure PDF.js worker only on client-side
  if (typeof window !== "undefined" && !isWorkerConfigured) {
    const { GlobalWorkerOptions } = await import("pdfjs-dist");
    GlobalWorkerOptions.workerSrc = "/pdfjs/build/pdf.worker.mjs";
    isWorkerConfigured = true;
  }

  // Fetch PDF as ArrayBuffer to avoid CORS issues
  const response = await fetch(pdfUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch PDF: ${response.status} ${response.statusText}`
    );
  }

  const pdfData = await response.arrayBuffer();

  if (pdfData.byteLength === 0) {
    throw new Error("PDF data is empty");
  }

  const pdfjsLib = await import("pdfjs-dist");
  const loadingTask = pdfjsLib.getDocument({ data: pdfData });
  return await loadingTask.promise;
}

/**
 * Render PDF page to canvas
 *
 * Renders specified page of a PDF document to a canvas element
 *
 * @param pdfDocument - PDF document object from loadPdfDocument
 * @param pageNumber - Page number to render (1-based)
 * @param canvas - HTMLCanvasElement to render to
 * @returns Scale factor used for rendering (for coordinate conversion)
 */
export async function renderPdfPage(
  pdfDocument: PdfDocument,
  pageNumber: number,
  canvas: HTMLCanvasElement
): Promise<number> {
  // Check if canvas exists
  if (!canvas) {
    throw new Error("Canvas element is null");
  }

  const doc = pdfDocument as { getPage: (n: number) => Promise<unknown> };
  const page = (await doc.getPage(pageNumber)) as {
    getViewport: (p: { scale: number }) => { width: number; height: number };
    render: (ctx: unknown) => { promise: Promise<void> };
  };
  const viewport = page.getViewport({ scale: PDF_SCALE });

  // Set canvas dimensions
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const canvasContext = canvas.getContext("2d");
  if (!canvasContext) {
    throw new Error("Failed to get canvas 2D context");
  }

  const renderContext = {
    canvasContext,
    viewport,
    canvas,
  };

  await page.render(renderContext as unknown).promise;

  // Return scale factor for coordinate conversion
  return PDF_SCALE;
}

/**
 * Get PDF page count
 *
 * @param pdfDocument - PDF document object
 * @returns Number of pages in PDF
 */
export function getPdfPageCount(pdfDocument: PdfDocument): number {
  const doc = pdfDocument as { numPages: number };
  return doc.numPages;
}

/**
 * Generate a signature image from signer data
 *
 * Creates a 400x150px canvas with:
 * - White background
 * - Black border
 * - Signer name (bold, 18px serif)
 * - Position and organization (14px sans-serif)
 * - Current date
 *
 * @param data - Signer information (organization, signerName, position)
 * @returns Base64 PNG data URL
 */
export function generateSignatureImage(data: Step3bFormData): string {
  // Create canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Canvas dimensions
  canvas.width = 400;
  canvas.height = 150;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Text styling
  ctx.fillStyle = "#000000";

  // Signer name (bold, 18px serif)
  ctx.font = "bold 18px serif";
  ctx.fillText(`Signed by: ${data.signerName}`, 15, 35);

  // Position (14px sans-serif)
  ctx.font = "14px sans-serif";
  ctx.fillText(`Position: ${data.position}`, 15, 65);

  // Organization (14px sans-serif)
  ctx.fillText(`Organization: ${data.organization}`, 15, 95);

  // Date (14px sans-serif)
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  ctx.fillText(`Date: ${date}`, 15, 125);

  // Return Base64 PNG data URL
  return canvas.toDataURL("image/png");
}

/**
 * Signature image dimensions
 */
export const SIGNATURE_IMAGE_WIDTH = 400;
export const SIGNATURE_IMAGE_HEIGHT = 150;

// ============================================================================
// Supabase Storage Utilities
// ============================================================================

import { supabase } from "@/lib/supabase";

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
