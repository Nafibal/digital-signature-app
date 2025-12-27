import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

    // Validate that document belongs to user
    const existingDocument = await prisma.document.findFirst({
      where: {
        id: documentId,
        ownerId: session.user.id,
      },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // Check if document already has content
    const documentWithContent = await prisma.document.findUnique({
      where: { id: documentId },
      select: { currentContentId: true },
    });

    let content;

    if (documentWithContent?.currentContentId) {
      // Update existing content
      content = await prisma.documentContent.update({
        where: { id: documentWithContent.currentContentId },
        data: {
          htmlContent: htmlContent,
        },
      });
    } else {
      // Create new content (first time)
      content = await prisma.documentContent.create({
        data: {
          documentId,
          htmlContent: htmlContent,
          version: 1,
        },
      });

      // Update document's current content reference
      await prisma.document.update({
        where: { id: documentId },
        data: { currentContentId: content.id },
      });
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

    // Validate that document belongs to user
    const existingDocument = await prisma.document.findFirst({
      where: {
        id: documentId,
        ownerId: session.user.id,
      },
      include: {
        currentContent: true,
      },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // Return current content
    return NextResponse.json(
      { content: existingDocument.currentContent },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/documents/[id]/content]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
