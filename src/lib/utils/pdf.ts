/**
 * PDF Rendering Utilities
 *
 * Load and render PDF using PDF.js
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

// Worker configuration state
let isWorkerConfigured = false;

/**
 * Load PDF document from URL
 *
 * Configures PDF.js worker on client-side only and loads the PDF document
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
 * Renders the specified page of a PDF document to a canvas element
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

  // Return the scale factor for coordinate conversion
  return PDF_SCALE;
}

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
