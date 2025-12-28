import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";

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
    const { documentPdfId, signatureData, signaturePosition, signatureImage } =
      body;

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

    // Validate that PDF belongs to document
    const existingPdf = await prisma.documentPdf.findFirst({
      where: {
        id: documentPdfId,
        documentId,
      },
    });

    if (!existingPdf) {
      return NextResponse.json(
        { message: "PDF not found for this document" },
        { status: 404 }
      );
    }

    // Upload signature image to Supabase Storage
    const base64Data = signatureImage.split(",")[1];
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Generate unique filename for signature image
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `signature-${timestamp}-${randomString}.png`;
    const filePath = `${session.user.id}/signatures/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("signatures")
      .upload(filePath, imageBuffer, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Signature upload error:", uploadError);
      return NextResponse.json(
        { message: "Failed to upload signature image" },
        { status: 500 }
      );
    }

    // Get public URL for signature image
    const { data: publicUrlData } = supabase.storage
      .from("signatures")
      .getPublicUrl(filePath);

    // Create signature record in database
    const signature = await prisma.signature.create({
      data: {
        documentId,
        documentPdfId,
        imagePath: filePath,
        pageNumber: signaturePosition.page || 1,
        posX: signaturePosition.x,
        posY: signaturePosition.y,
        width: 400, // Signature image width
        height: 150, // Signature image height
        signerName: signatureData.signerName,
        signerPosition: signatureData.position,
        organization: signatureData.organization,
      },
    });

    return NextResponse.json(
      {
        success: true,
        signature: {
          id: signature.id,
          imagePath: signature.imagePath,
          publicUrl: publicUrlData.publicUrl,
          posX: signature.posX,
          posY: signature.posY,
          width: signature.width,
          height: signature.height,
          signerName: signature.signerName,
          signerPosition: signature.signerPosition,
          organization: signature.organization,
          pageNumber: signature.pageNumber,
        },
      },
      { status: 201 }
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

    // Validate that document belongs to user
    const existingDocument = await prisma.document.findFirst({
      where: {
        id: documentId,
        ownerId: session.user.id,
      },
      include: {
        signatures: true,
      },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // Return signatures (most recent first)
    const signatures = existingDocument.signatures.map((sig) => ({
      id: sig.id,
      imagePath: sig.imagePath,
      publicUrl: supabase.storage.from("signatures").getPublicUrl(sig.imagePath)
        .data.publicUrl,
      posX: sig.posX,
      posY: sig.posY,
      width: sig.width,
      height: sig.height,
      signerName: sig.signerName,
      signerPosition: sig.signerPosition,
      organization: sig.organization,
      pageNumber: sig.pageNumber,
      createdAt: sig.createdAt,
    }));

    return NextResponse.json({ signatures }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/documents/[id]/signature]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
