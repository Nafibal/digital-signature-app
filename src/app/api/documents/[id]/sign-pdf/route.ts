import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { embedSignatureIntoPdf } from "@/lib/utils/pdf-embed";
import { PdfPosition } from "@/lib/utils/coordinates";

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
    const body = await req.json();

    // Validate required fields
    const { documentPdfId, signatureImage, position } = body;

    if (!documentPdfId) {
      return NextResponse.json(
        { message: "documentPdfId is required" },
        { status: 400 }
      );
    }

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

    // Fetch original PDF bytes from Supabase Storage
    const { data: pdfData, error: pdfError } = await supabase.storage
      .from("documents")
      .download(existingPdf.pdfPath);

    if (pdfError || !pdfData) {
      console.error("PDF download error:", pdfError);
      return NextResponse.json(
        { message: "Failed to download PDF" },
        { status: 500 }
      );
    }

    const pdfBytes = new Uint8Array(await pdfData.arrayBuffer());

    // Embed signature into PDF
    const signedPdfBytes = await embedSignatureIntoPdf(
      pdfBytes,
      signatureImage,
      position as PdfPosition
    );

    // Generate unique filename for signed PDF
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `signed-${timestamp}-${randomString}-${existingPdf.fileName}`;
    const filePath = `${session.user.id}/signed/${fileName}`;

    // Upload signed PDF to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, Buffer.from(signedPdfBytes), {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Signed PDF upload error:", uploadError);
      return NextResponse.json(
        { message: "Failed to upload signed PDF" },
        { status: 500 }
      );
    }

    // Get public URL for signed PDF
    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    // Create new DocumentPdf record for signed version
    const signedPdf = await prisma.documentPdf.create({
      data: {
        documentId,
        pdfPath: filePath,
        fileName: existingPdf.fileName,
        fileSize: signedPdfBytes.length,
        pageCount: existingPdf.pageCount,
        status: "signed",
      },
    });

    // Update document's current PDF reference
    await prisma.document.update({
      where: { id: documentId },
      data: { currentPdfId: signedPdf.id },
    });

    return NextResponse.json(
      {
        success: true,
        signedPdf: {
          id: signedPdf.id,
          documentId: signedPdf.documentId,
          pdfPath: signedPdf.pdfPath,
          fileName: signedPdf.fileName,
          fileSize: signedPdf.fileSize,
          pageCount: signedPdf.pageCount,
          status: signedPdf.status,
          publicUrl: publicUrlData.publicUrl,
          createdAt: signedPdf.createdAt,
          updatedAt: signedPdf.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/documents/[id]/sign-pdf]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
