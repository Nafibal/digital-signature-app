import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";

/**
 * Helper function to generate public URL from PDF path
 * Uses Supabase Storage public URL (bucket is now public)
 */
function getPublicUrl(pdfPath: string | null): string | null {
  if (!pdfPath) return null;
  const { data } = supabase.storage.from("documents").getPublicUrl(pdfPath);
  return data.publicUrl;
}

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

    // Fetch the document with ownership check
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        ownerId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        documentType: true,
        currentStep: true,
        subStep: true,
        status: true,
        sourceType: true,
        pdfPath: true,
        currentPdfId: true,
        currentPdf: {
          select: {
            id: true,
            pdfPath: true,
            fileName: true,
            fileSize: true,
            pageCount: true,
            status: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    // Return 404 if document not found or doesn't belong to user
    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // Transform response to include public URL
    const response = {
      ...document,
      currentPdf: document.currentPdf
        ? {
            ...document.currentPdf,
            publicUrl: getPublicUrl(document.currentPdf.pdfPath),
          }
        : null,
    };

    // Response
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[GET /api/documents/[id]]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    // Update only the provided fields
    const updatedDocument = await prisma.document.update({
      where: {
        id: documentId,
      },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.documentType !== undefined && {
          documentType: body.documentType,
        }),
        ...(body.sourceType !== undefined && {
          sourceType: body.sourceType,
        }),
        ...(body.currentStep !== undefined && {
          currentStep: body.currentStep,
        }),
        ...(body.subStep !== undefined && {
          subStep: body.subStep,
        }),
        ...(body.pdfPath !== undefined && {
          pdfPath: body.pdfPath,
        }),
        ...(body.currentPdfId !== undefined && {
          currentPdfId: body.currentPdfId,
        }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        documentType: true,
        currentStep: true,
        subStep: true,
        status: true,
        sourceType: true,
        pdfPath: true,
        currentPdfId: true,
        currentPdf: {
          select: {
            id: true,
            pdfPath: true,
            fileName: true,
            fileSize: true,
            pageCount: true,
            status: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    // Transform response to include public URL
    const response = {
      ...updatedDocument,
      currentPdf: updatedDocument.currentPdf
        ? {
            ...updatedDocument.currentPdf,
            publicUrl: getPublicUrl(updatedDocument.currentPdf.pdfPath),
          }
        : null,
    };

    // Response
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/documents/[id]]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
