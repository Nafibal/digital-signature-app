import { auth } from "@/server/auth/config";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { uploadPDF } from "@/lib/helpers";

export async function POST(req: Request) {
  try {
    // Authenticate request
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { message: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const uploadResult = await uploadPDF(file, session.user.id);

    // Return upload result
    return NextResponse.json(
      {
        filePath: uploadResult.path,
        fullPath: uploadResult.fullPath,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/upload]", error);

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
