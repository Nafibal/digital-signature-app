import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generatePDFFromTiptapJson } from "@/lib/utils/pdf-generator";

// POST /api/documents/[id]/preview
// Generate PDF preview from Tiptap JSON and return directly for live preview
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate the request
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const documentId = params.id;
    const body = await req.json();

    // Validate required fields
    if (!body.tiptapJson) {
      return NextResponse.json(
        { message: "tiptapJson is required" },
        { status: 400 }
      );
    }

    // Validate that document belongs to user
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        ownerId: session.user.id,
      },
    });

    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // Generate PDF from Tiptap JSON
    const pdfBytes = await generatePDFFromTiptapJson(body.tiptapJson);

    // Return PDF directly as binary response for live preview
    return new NextResponse(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=preview.pdf",
        "Content-Length": pdfBytes.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[POST /api/documents/[id]/preview]", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
