import { auth } from "@/server/auth/config";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  getDocumentByIdForUser,
  updateDocumentForUser,
} from "@/server/services";

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

    // Get document using service layer
    const document = await getDocumentByIdForUser(documentId, session.user.id);

    // Return 404 if document not found
    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // Response
    return NextResponse.json(document, { status: 200 });
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

    // Update document using service layer
    const updatedDocument = await updateDocumentForUser(
      documentId,
      session.user.id,
      body
    );

    if (!updatedDocument) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // Response
    return NextResponse.json(updatedDocument, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/documents/[id]]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
