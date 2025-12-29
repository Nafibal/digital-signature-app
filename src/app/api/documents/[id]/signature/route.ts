import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { saveSignature, getDocumentSignaturesForUser } from "@/server/services";

// POST /api/documents/[id]/signature
// Save signature metadata and image
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
    const body = await req.json();

    // Validate required fields
    const {
      documentPdfId,
      signatureData,
      signaturePosition,
      canvasPosition,
      signatureImage,
    } = body;

    if (!documentPdfId) {
      return NextResponse.json(
        { message: "documentPdfId is required" },
        { status: 400 }
      );
    }

    if (!signatureData) {
      return NextResponse.json(
        { message: "signatureData is required" },
        { status: 400 }
      );
    }

    if (!signaturePosition) {
      return NextResponse.json(
        { message: "signaturePosition is required" },
        { status: 400 }
      );
    }

    if (!signatureImage) {
      return NextResponse.json(
        { message: "signatureImage is required" },
        { status: 400 }
      );
    }

    // Save signature using service layer
    const result = await saveSignature(documentId, session.user.id, {
      documentPdfId,
      signatureData,
      signaturePosition,
      canvasPosition,
      signatureImage,
    });

    if (!result) {
      return NextResponse.json(
        { message: "Document or PDF not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        signature: result.signature,
      },
      { status: result.signature ? 201 : 200 }
    );
  } catch (error) {
    console.error("[POST /api/documents/[id]/signature]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/documents/[id]/signature
// Get signature for document
export async function GET(
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

    // Get signatures using service layer
    const signatures = await getDocumentSignaturesForUser(
      documentId,
      session.user.id
    );

    if (!signatures) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ signatures }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/documents/[id]/signature]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
