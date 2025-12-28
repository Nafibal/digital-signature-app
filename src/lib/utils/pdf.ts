/**
 * PDF Rendering Utilities
 *
 * Load and render PDF using PDF.js
 */

// PDF scale factor for better rendering quality
export const PDF_SCALE = 1.5;

/**
 * PDF document interface
 * Represents a loaded PDF document from PDF.js
 */
export interface PdfDocument {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
}

/**
 * PDF page interface
 * Represents a page in a PDF document
 */
export interface PdfPage {
  getViewport: (params: { scale: number }) => PdfViewport;
  render: (renderContext: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PdfViewport;
    canvas: HTMLCanvasElement;
  }) => { promise: Promise<void> };
}

/**
 * PDF viewport interface
 * Represents the viewport for rendering a PDF page
 */
export interface PdfViewport {
  width: number;
  height: number;
}

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
  // Configure PDF.js worker only on client-side
  if (typeof window !== "undefined" && !isWorkerConfigured) {
    const { GlobalWorkerOptions } = await import("pdfjs-dist");
    GlobalWorkerOptions.workerSrc = "/pdfjs/build/pdf.worker.mjs";
    isWorkerConfigured = true;
  }

  // Fetch PDF as ArrayBuffer to avoid CORS issues
  const response = await fetch(pdfUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  }
  const pdfData = await response.arrayBuffer();

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

  const page = await pdfDocument.getPage(pageNumber);
  const viewport = page.getViewport({ scale: PDF_SCALE });

  // Set canvas dimensions
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  // Render page to canvas
  const renderContext = {
    canvasContext: canvas.getContext("2d")!,
    viewport: viewport,
    canvas: canvas,
  };

  await page.render(renderContext).promise;

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
  return pdfDocument.numPages;
}
