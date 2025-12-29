import { auth } from "@/server/auth/config";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createDocumentSchema } from "./schema";
import { getAllDocumentsForUser, createNewDocument } from "@/server/services";

export async function GET() {
  try {
    // Authenticate the request
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch all documents for the authenticated user
    const documents = await getAllDocumentsForUser(session.user.id);

    // Response
    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/documents]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Authenticate the request
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    const parsed = createDocumentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { title, description, documentType } = parsed.data;

    // Create document using service layer
    const document = await createNewDocument({
      ownerId: session.user.id,
      title,
      description: description ?? "",
      documentType: documentType ?? "contract",
    });

    // Response
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("[POST /api/documents]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
