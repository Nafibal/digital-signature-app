import { chromium } from "playwright";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadPDF } from "@/lib/utils/storage";
import { supabase } from "@/lib/supabase";

// Must use Node.js runtime for Playwright
export const runtime = "nodejs";

// POST /api/documents/[id]/generate-pdf
// Generate PDF from HTML content and upload to Supabase Storage
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let browser = null;

  try {
    // Authenticate the request
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const documentId = (await params).id;

    // Get document with HTML content
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        ownerId: session.user.id,
      },
      include: {
        currentContent: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    if (!document.currentContent?.htmlContent) {
      return NextResponse.json(
        { message: "Document content not found" },
        { status: 404 }
      );
    }

    const html = document.currentContent.htmlContent;

    // Launch Playwright browser
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Wrap HTML in complete document structure with proper styling
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #000;
              margin: 0;
              padding: 0;
            }

            h1 {
              font-size: 24pt;
              font-weight: 700;
              margin: 20px 0 10px;
              line-height: 1.2;
            }

            h2 {
              font-size: 18pt;
              font-weight: 600;
              margin: 18px 0 8px;
              line-height: 1.3;
            }

            h3 {
              font-size: 14pt;
              font-weight: 600;
              margin: 16px 0 6px;
              line-height: 1.4;
            }

            p {
              margin: 0 0 12px;
              text-align: justify;
            }

            strong, b {
              font-weight: 700;
            }

            em, i {
              font-style: italic;
            }

            u {
              text-decoration: underline;
            }

            ul, ol {
              margin: 0 0 12px;
              padding-left: 24px;
            }

            li {
              margin: 4px 0;
            }

            blockquote {
              margin: 12px 0;
              padding-left: 16px;
              border-left: 3px solid #ccc;
              color: #555;
            }

            code {
              font-family: "Courier New", monospace;
              background: #f5f5f5;
              padding: 2px 4px;
              border-radius: 3px;
            }

            pre {
              background: #f5f5f5;
              padding: 12px;
              border-radius: 4px;
              overflow-x: auto;
            }

            pre code {
              background: none;
              padding: 0;
            }

            a {
              color: #0066cc;
              text-decoration: underline;
            }

            hr {
              border: none;
              border-top: 1px solid #ccc;
              margin: 20px 0;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin: 12px 0;
            }

            th, td {
              border: 1px solid #ddd;
              padding: 8px 12px;
              text-align: left;
            }

            th {
              background: #f5f5f5;
              font-weight: 600;
            }

            /* Ensure proper page breaks */
            h1, h2, h3 {
              page-break-after: avoid;
            }

            table, tr, td, th {
              page-break-inside: avoid;
            }

            /* Remove script tags for security */
            script {
              display: none !important;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // Set content and wait for network to be idle
    await page.setContent(fullHtml, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    // Generate PDF with A4 format
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "20mm",
        right: "20mm",
      },
    });

    // Close browser
    await browser.close();

    // Create File object from PDF buffer
    const pdfBlob = new Blob([pdfBuffer], { type: "application/pdf" });
    const pdfFile = new File([pdfBlob], `document-${documentId}.pdf`, {
      type: "application/pdf",
    });

    // Upload PDF to Supabase Storage
    const uploadResult = await uploadPDF(pdfFile, session.user.id);

    // Create DocumentPdf record
    const documentPdf = await prisma.documentPdf.create({
      data: {
        documentId,
        pdfPath: uploadResult.path,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        pageCount: 1, // TODO: Calculate actual page count from PDF
        status: "ready",
      },
    });

    // Update document's current PDF reference
    await prisma.document.update({
      where: { id: documentId },
      data: { currentPdfId: documentPdf.id },
    });

    // Get public URL from Supabase Storage
    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(uploadResult.path);

    return NextResponse.json(
      {
        id: documentPdf.id,
        documentId: documentPdf.documentId,
        pdfPath: uploadResult.path,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        pageCount: documentPdf.pageCount,
        status: documentPdf.status,
        publicUrl: publicUrlData.publicUrl,
        createdAt: documentPdf.createdAt.toISOString(),
        updatedAt: documentPdf.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    // Ensure browser is closed on error
    if (browser) {
      await browser.close();
    }

    console.error("[POST /api/documents/[id]/generate-pdf]", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to generate PDF",
      },
      { status: 500 }
    );
  }
}
