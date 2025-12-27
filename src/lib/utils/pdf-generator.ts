/**
 * PDF Generator Utility
 * Generates PDF from Tiptap JSON using pdf-lib
 */

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { TiptapNode } from "@/lib/types/document";

/**
 * Generate PDF from Tiptap JSON
 * @param tiptapJson - Tiptap JSON object
 * @returns PDF bytes as Uint8Array
 */
export async function generatePDFFromTiptapJson(
  tiptapJson: any
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4 dimensions (points)
  const font = await pdf.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdf.embedFont(StandardFonts.TimesRomanBold);

  let y = 800; // Start from top of page
  const margin = 50;
  const pageWidth = 595;
  const maxWidth = pageWidth - margin * 2;

  // Process Tiptap JSON nodes
  const nodes = tiptapJson.content || [];
  for (const node of nodes) {
    const result = renderNode(node, page, font, boldFont, y, margin, maxWidth);
    y = result.y;

    // Check if we need a new page
    if (y < 50) {
      const newPage = pdf.addPage([595, 842]);
      y = 800;
      // Continue rendering on new page would go here
    }
  }

  return pdf.save();
}

/**
 * Render a Tiptap node to PDF
 */
function renderNode(
  node: TiptapNode,
  page: any,
  font: any,
  boldFont: any,
  y: number,
  x: number,
  maxWidth: number
): { y: number } {
  switch (node.type) {
    case "heading":
      return renderHeading(node, page, boldFont, y, x, maxWidth);
    case "paragraph":
      return renderParagraph(node, page, font, y, x, maxWidth);
    case "bulletList":
      return renderBulletList(node, page, font, y, x, maxWidth);
    case "orderedList":
      return renderOrderedList(node, page, font, y, x, maxWidth);
    case "blockquote":
      return renderBlockquote(node, page, font, y, x, maxWidth);
    case "listItem":
      return renderListItem(node, page, font, y, x, maxWidth);
    default:
      return { y };
  }
}

/**
 * Render heading node
 */
function renderHeading(
  node: TiptapNode,
  page: any,
  font: any,
  y: number,
  x: number,
  maxWidth: number
): { y: number } {
  const level = node.attrs?.level || 1;
  const fontSize = level === 1 ? 18 : level === 2 ? 14 : 12;
  const text = extractText(node);

  const lines = wrapText(text, maxWidth, font, fontSize);

  for (const line of lines) {
    page.drawText(line, {
      x,
      y,
      size: fontSize,
      font,
    });
    y -= fontSize + 4;
  }

  return { y: y - 10 }; // Extra spacing after heading
}

/**
 * Render paragraph node
 */
function renderParagraph(
  node: TiptapNode,
  page: any,
  font: any,
  y: number,
  x: number,
  maxWidth: number
): { y: number } {
  const text = extractText(node);
  const lines = wrapText(text, maxWidth, font, 12);

  for (const line of lines) {
    page.drawText(line, {
      x,
      y,
      size: 12,
      font,
    });
    y -= 16; // Line height
  }

  return { y: y - 8 }; // Paragraph spacing
}

/**
 * Render bullet list node
 */
function renderBulletList(
  node: TiptapNode,
  page: any,
  font: any,
  y: number,
  x: number,
  maxWidth: number
): { y: number } {
  const items = node.content || [];
  for (const item of items) {
    if (item.type === "listItem") {
      const text = extractText(item);
      page.drawText(`• ${text}`, {
        x,
        y,
        size: 12,
        font,
      });
      y -= 16;
    }
  }
  return { y: y - 8 };
}

/**
 * Render ordered list node
 */
function renderOrderedList(
  node: TiptapNode,
  page: any,
  font: any,
  y: number,
  x: number,
  maxWidth: number
): { y: number } {
  const items = node.content || [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].type === "listItem") {
      const text = extractText(items[i]);
      page.drawText(`${i + 1}. ${text}`, {
        x,
        y,
        size: 12,
        font,
      });
      y -= 16;
    }
  }
  return { y: y - 8 };
}

/**
 * Render list item node
 */
function renderListItem(
  node: TiptapNode,
  page: any,
  font: any,
  y: number,
  x: number,
  maxWidth: number
): { y: number } {
  const text = extractText(node);
  page.drawText(text, {
    x,
    y,
    size: 12,
    font,
  });
  return { y: y - 16 };
}

/**
 * Render blockquote node
 */
function renderBlockquote(
  node: TiptapNode,
  page: any,
  font: any,
  y: number,
  x: number,
  maxWidth: number
): { y: number } {
  const text = extractText(node);
  const lines = wrapText(text, maxWidth - 20, font, 12);

  // Draw vertical line
  page.drawLine({
    start: { x: x - 10, y: y + 5 },
    end: { x: x - 10, y: y - lines.length * 16 + 5 },
    thickness: 2,
    color: rgb(0.5, 0.5, 0.5),
  });

  for (const line of lines) {
    page.drawText(line, {
      x: x + 5,
      y,
      size: 12,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 16;
  }

  return { y: y - 8 };
}

/**
 * Extract text from a Tiptap node
 */
function extractText(node: TiptapNode): string {
  if (node.text) {
    return node.text;
  }
  if (node.content) {
    return node.content.map(extractText).join("");
  }
  return "";
}

/**
 * Wrap text to fit within maxWidth
 */
function wrapText(
  text: string,
  maxWidth: number,
  font: any,
  fontSize: number
): string[] {
  const lines: string[] = [];
  const words = text.split(" ");
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width > maxWidth) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Word is too long, break it
        lines.push(word);
      }
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
