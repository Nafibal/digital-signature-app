import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createDocumentSchema } from "./schema";
import { prisma } from "@/lib/db";
import { DocumentStatus } from "@/lib/generated/prisma";

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
    const documents = await prisma.document.findMany({
      where: {
        ownerId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        documentType: true,
        currentStep: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

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

    // Create document (workflow initialized at Step 2 since user will proceed to Step 2 after creation)
    const document = await prisma.document.create({
      data: {
        ownerId: session.user.id,
        title,
        description,
        documentType,
        currentStep: 2,
        status: DocumentStatus.draft,
      },
      select: {
        id: true,
        title: true,
        description: true,
        documentType: true,
        currentStep: true,
        status: true,
      },
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
