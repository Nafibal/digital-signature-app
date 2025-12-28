/**
 * Signature Image Generation Utility
 *
 * Generates signature images from signer information using HTML5 Canvas
 */

import { Step3bFormData } from "@/lib/types/document";

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
