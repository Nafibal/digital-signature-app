/**
 * PDF Embedding Utilities
 *
 * Embed signature images into PDF documents using pdf-lib
 */

import { PDFDocument } from "pdf-lib";

/**
 * Type for PDF position coordinates
 */
export interface PdfPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  page?: number;
}

/**
 * Embed signature image into PDF
 *
 * Loads a PDF document, embeds a PNG signature image at the specified position,
 * and returns the modified PDF bytes.
 *
 * @param pdfBytes - Original PDF document as Uint8Array
 * @param signatureImage - Base64 PNG data URL of signature
 * @param position - PDF position coordinates (x, y, width, height)
 * @returns Modified PDF bytes as Uint8Array
 */
export async function embedSignatureIntoPdf(
  pdfBytes: Uint8Array,
  signatureImage: string,
  position: PdfPosition
): Promise<Uint8Array> {
  // Load PDF document
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  // Get the correct page (default to page 1 if not specified)
  const pageIndex = (position.page || 1) - 1; // Convert to 0-based index
  const targetPage = pages[pageIndex] || pages[0];

  // Convert data URL to Uint8Array
  const base64Data = signatureImage.split(",")[1];
  const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

  // Embed PNG image
  const pngImage = await pdfDoc.embedPng(imageBytes);

  // Draw image at specified position on the target page
  targetPage.drawImage(pngImage, {
    x: position.x,
    y: position.y,
    width: position.width,
    height: position.height,
  });

  // Save and return modified PDF
  return await pdfDoc.save();
}

/**
 * Create a Blob from PDF bytes
 *
 * @param pdfBytes - PDF bytes as Uint8Array
 * @param filename - Filename for the blob
 * @returns Blob object
 */
export function createPdfBlob(
  pdfBytes: Uint8Array,
  filename: string = "signed-document.pdf"
): Blob {
  return new Blob([new Uint8Array(pdfBytes)], {
    type: "application/pdf",
  });
}

/**
 * Create a download link for PDF
 *
 * @param pdfBytes - PDF bytes as Uint8Array
 * @param filename - Filename for download
 */
export function downloadPdf(
  pdfBytes: Uint8Array,
  filename: string = "signed-document.pdf"
): void {
  const blob = createPdfBlob(pdfBytes, filename);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Create a Blob URL for PDF preview
 *
 * @param pdfBytes - PDF bytes as Uint8Array
 * @returns Blob URL string
 */
export function createPdfBlobUrl(pdfBytes: Uint8Array): string {
  const blob = createPdfBlob(pdfBytes);
  return URL.createObjectURL(blob);
}
