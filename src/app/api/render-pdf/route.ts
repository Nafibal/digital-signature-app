import { chromium } from "playwright";
import { NextResponse } from "next/server";

// Must use Node.js runtime for Playwright
export const runtime = "nodejs";

// POST /api/render-pdf
// Generate PDF from HTML content using Playwright Chromium
export async function POST(req: Request) {
  let browser = null;

  try {
    const { html } = await req.json();

    // Validate input
    if (!html) {
      return NextResponse.json(
        { error: "Missing HTML content" },
        { status: 400 }
      );
    }

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

    // Return PDF as binary response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=preview.pdf",
        "Content-Length": pdfBuffer.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    // Ensure browser is closed on error
    if (browser) {
      await browser.close();
    }

    console.error("[POST /api/render-pdf]", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate PDF",
      },
      { status: 500 }
    );
  }
}
