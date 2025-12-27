/**
 * PDF.js Worker Configuration
 *
 * This module configures pdf.js to use a local worker instead of CDN,
 * avoiding "Setting up fake worker failed" errors and improving reliability.
 */

import * as pdfjsLib from "pdfjs-dist";

// IMPORTANT: local worker (no CDN)
// This uses the worker file from node_modules/pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

export default pdfjsLib;
