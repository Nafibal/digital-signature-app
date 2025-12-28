import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";

// GET /api/documents/[id]/pdf/[pdfId]
// Proxy endpoint to serve PDF from Supabase Storage
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; pdfId: string }> }
) {
  try {
    // Authenticate the request
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: documentId, pdfId } = await params;

    // Fetch document with PDF and ownership check
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        ownerId: session.user.id,
        currentPdfId: pdfId,
      },
      include: {
        currentPdf: true,
      },
    });

    if (!document || !document.currentPdf) {
      return NextResponse.json({ message: "PDF not found" }, { status: 404 });
    }

    // Download PDF from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("documents")
      .download(document.currentPdf.pdfPath);

    if (downloadError) {
      console.error("Error downloading PDF from Supabase:", downloadError);
      return NextResponse.json(
        { message: "Failed to download PDF" },
        { status: 500 }
      );
    }

    // Return PDF as response
    return new NextResponse(fileData, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${document.currentPdf.fileName}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[GET /api/documents/[id]/pdf/[pdfId]]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
