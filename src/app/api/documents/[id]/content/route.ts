import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  saveDocumentContent,
  getDocumentContentForUser,
} from "@/server/services";

// POST /api/documents/[id]/content
// Create or update document content
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
    const body = await req.json();

    // Extract HTML content from body (handle both string and object formats)
    let htmlContent: string;
    if (typeof body.htmlContent === "string") {
      htmlContent = body.htmlContent;
    } else if (
      body.htmlContent &&
      typeof body.htmlContent === "object" &&
      "html" in body.htmlContent
    ) {
      htmlContent = (body.htmlContent as { html: string }).html;
    } else {
      return NextResponse.json(
        { message: "htmlContent is required" },
        { status: 400 }
      );
    }

    // Save document content using service layer
    const content = await saveDocumentContent(
      documentId,
      session.user.id,
      htmlContent
    );

    if (!content) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error("[POST /api/documents/[id]/content]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/documents/[id]/content
// Get current document content
export async function GET(
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

    // Get document content using service layer
    const content = await getDocumentContentForUser(
      documentId,
      session.user.id
    );

    if (!content) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // Return current content
    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/documents/[id]/content]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
