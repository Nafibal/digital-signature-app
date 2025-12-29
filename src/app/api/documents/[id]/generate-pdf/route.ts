import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getDocumentWithContent } from "@/server/queries/documents";
import { generatePdfFromHtml, setCurrentPdf } from "@/server/services";

// Must use Node.js runtime for Playwright
export const runtime = "nodejs";

// POST /api/documents/[id]/generate-pdf
// Generate PDF from HTML content and upload to Supabase Storage
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const document = await getDocumentWithContent(documentId, session.user.id);

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

    // Generate PDF from HTML using service layer
    const result = await generatePdfFromHtml(documentId, html, session.user.id);

    // Update document's current PDF reference
    await setCurrentPdf(documentId, result.id);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
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
