import { auth } from "@/server/auth/config";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { signPdf as signPdfService } from "@/server/services";
import { isValidUuid } from "@/lib/utils/uuid";

// POST /api/documents/[id]/sign-pdf
// Embed signature into PDF and upload signed version
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate request
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const documentId = (await params).id;

    // Validate documentId is a valid UUID
    if (!isValidUuid(documentId)) {
      return NextResponse.json(
        { message: "Invalid document ID format" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Validate required fields
    const { signatureImage, position } = body;

    if (!signatureImage) {
      return NextResponse.json(
        { message: "signatureImage is required" },
        { status: 400 }
      );
    }

    if (!position) {
      return NextResponse.json(
        { message: "position is required" },
        { status: 400 }
      );
    }

    // Sign PDF using service layer
    const result = await signPdfService(documentId, session.user.id, {
      signatureImage,
      position,
    });

    if (!result) {
      return NextResponse.json(
        { message: "Document not found or has no PDF to sign" },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[POST /api/documents/[id]/sign-pdf]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
