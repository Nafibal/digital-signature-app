/**
 * Coordinate Conversion Utilities
 *
 * Convert between canvas display coordinates and PDF embedding coordinates
 */

import { PDF_SCALE } from "./pdf";

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
