/**
 * PDF Server Utilities
 *
 * Server-side PDF utilities for PDF processing
 */

// PDF scale factor for better rendering quality
export const PDF_SCALE = 1.5;

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

/**
 * Get PDF page count
 *
 * @param pdfDocument - PDF document object
 * @returns Number of pages in the PDF
 */
export function getPdfPageCount(pdfDocument: PdfDocument): number {
  const doc = pdfDocument as { numPages: number };
  return doc.numPages;
}
