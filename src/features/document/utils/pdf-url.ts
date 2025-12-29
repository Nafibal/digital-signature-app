/**
 * PDF URL Utilities
 *
 * Provides consistent methods for constructing PDF URLs throughout the application.
 * This ensures a single source of truth for PDF URL construction.
 */

import type { DocumentPdfResponse } from "../types";

/**
 * PDF interface from services.ts (without publicUrl)
 */
interface DocumentPdf {
  id: string;
  pdfPath: string;
  fileName: string;
  fileSize: number;
  pageCount?: number;
  status: string;
}

/**
 * Get PDF URL from a DocumentPdfResponse
 * Uses publicUrl from Supabase as the single source of truth
 *
 * @param pdf - The PDF response object
 * @returns The public URL of PDF, or empty string if not available
 *
 * @example
 * ```tsx
 * const pdfUrl = getPdfUrl(documentPdf);
 * if (pdfUrl) {
 *   <iframe src={pdfUrl} />
 * }
 * ```
 */
export function getPdfUrl(pdf: DocumentPdfResponse | null): string {
  return pdf?.publicUrl || "";
}

/**
 * Get PDF URL from DocumentPdf type (from services.ts)
 * Uses manual URL construction since publicUrl is not available
 *
 * @param pdf - The PDF object from services
 * @param documentId - The document ID
 * @returns The PDF URL
 *
 * @example
 * ```tsx
 * const pdfUrl = getPdfUrlFromDocumentPdf(signedPdf, documentId);
 * ```
 */
export function getPdfUrlFromDocumentPdf(
  pdf: DocumentPdf | null,
  documentId: string
): string {
  if (pdf && documentId) {
    return `/api/documents/${documentId}/pdf/${pdf.id}`;
  }
  return "";
}
