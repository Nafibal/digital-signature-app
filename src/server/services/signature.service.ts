/**
 * Signature Service
 *
 * Business logic for signature operations
 */

import { prisma } from "../db";
import { supabase } from "../storage";
import { embedSignatureIntoPdf, PdfPosition } from "../utils/pdf-embed";
import {
  getDocumentPdfById,
  getSignatureByDocumentPdfId,
} from "../queries/documents";
import { createSignature, updateSignature } from "../mutations/documents";

/**
 * Save signature metadata and image
 */
export async function saveSignature(
  documentId: string,
  userId: string,
  data: {
    documentPdfId: string;
    signatureData: {
      signerName: string;
      position: string;
      organization: string;
    };
    signaturePosition: {
      x: number;
      y: number;
      page?: number;
    };
    canvasPosition?: {
      x: number;
      y: number;
    };
    signatureImage: string;
  }
) {
  // Validate that document belongs to user
  const existingDocument = await prisma.document.findFirst({
    where: {
      id: documentId,
      ownerId: userId,
    },
  });

  if (!existingDocument) {
    return null;
  }

  // Validate that PDF belongs to document
  const existingPdf = await prisma.documentPdf.findFirst({
    where: {
      id: data.documentPdfId,
      documentId,
    },
  });

  if (!existingPdf) {
    return null;
  }

  // Check if signature already exists for this documentPdfId
  const existingSignature = await getSignatureByDocumentPdfId(
    data.documentPdfId
  );

  let signature;
  let filePath;
  let publicUrl;

  if (existingSignature) {
    // Delete old signature image from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from("signatures")
      .remove([existingSignature.imagePath]);

    if (deleteError) {
      console.error("Error deleting old signature image:", deleteError);
      // Continue with update even if deletion fails
    }

    // Upload new signature image to Supabase Storage
    const base64Data = data.signatureImage.split(",")[1];
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Generate unique filename for signature image
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `signature-${timestamp}-${randomString}.png`;
    filePath = `${userId}/signatures/${fileName}`;

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
      throw new Error("Failed to upload signature image");
    }

    // Get public URL for signature image
    const { data: publicUrlData } = supabase.storage
      .from("signatures")
      .getPublicUrl(filePath);
    publicUrl = publicUrlData.publicUrl;

    // Update existing signature record in database
    signature = await updateSignature(existingSignature.id, {
      imagePath: filePath,
      pageNumber: data.signaturePosition.page || 1,
      posX: data.signaturePosition.x,
      posY: data.signaturePosition.y,
      canvasPosX: data.canvasPosition?.x,
      canvasPosY: data.canvasPosition?.y,
      width: 400,
      height: 150,
      signerName: data.signatureData.signerName,
      signerPosition: data.signatureData.position,
      organization: data.signatureData.organization,
    });
  } else {
    // Upload signature image to Supabase Storage
    const base64Data = data.signatureImage.split(",")[1];
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Generate unique filename for signature image
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `signature-${timestamp}-${randomString}.png`;
    filePath = `${userId}/signatures/${fileName}`;

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
      throw new Error("Failed to upload signature image");
    }

    // Get public URL for signature image
    const { data: publicUrlData } = supabase.storage
      .from("signatures")
      .getPublicUrl(filePath);
    publicUrl = publicUrlData.publicUrl;

    // Create new signature record in database
    signature = await createSignature({
      documentId,
      documentPdfId: data.documentPdfId,
      imagePath: filePath,
      pageNumber: data.signaturePosition.page || 1,
      posX: data.signaturePosition.x,
      posY: data.signaturePosition.y,
      canvasPosX: data.canvasPosition?.x,
      canvasPosY: data.canvasPosition?.y,
      width: 400,
      height: 150,
      signerName: data.signatureData.signerName,
      signerPosition: data.signatureData.position,
      organization: data.signatureData.organization,
    });
  }

  return {
    success: true,
    signature: {
      id: signature.id,
      imagePath: signature.imagePath,
      publicUrl: publicUrl,
      posX: signature.posX,
      posY: signature.posY,
      canvasPosX: signature.canvasPosX,
      canvasPosY: signature.canvasPosY,
      width: signature.width,
      height: signature.height,
      signerName: signature.signerName,
      signerPosition: signature.signerPosition,
      organization: signature.organization,
      pageNumber: signature.pageNumber,
    },
  };
}

/**
 * Sign PDF by embedding signature
 */
export async function signPdf(
  documentId: string,
  userId: string,
  data: {
    signatureImage: string;
    position: PdfPosition;
  }
) {
  // Validate that document belongs to user and has a current PDF
  const existingDocument = await prisma.document.findFirst({
    where: {
      id: documentId,
      ownerId: userId,
    },
    include: {
      currentPdf: true,
    },
  });

  if (!existingDocument) {
    return null;
  }

  if (!existingDocument.currentPdfId) {
    throw new Error("Document has no PDF to sign");
  }

  // Use currentPdf (original/unsigned PDF) for signing
  const existingPdf = existingDocument.currentPdf;

  if (!existingPdf) {
    throw new Error("PDF not found for this document");
  }

  // Fetch original PDF bytes from Supabase Storage
  const { data: pdfData, error: pdfError } = await supabase.storage
    .from("documents")
    .download(existingPdf.pdfPath);

  if (pdfError || !pdfData) {
    console.error("PDF download error:", pdfError);
    throw new Error("Failed to download PDF");
  }

  const pdfBytes = new Uint8Array(await pdfData.arrayBuffer());

  // Embed signature into PDF
  const signedPdfBytes = await embedSignatureIntoPdf(
    pdfBytes,
    data.signatureImage,
    data.position
  );

  // Generate unique filename for signed PDF
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileName = `signed-${timestamp}-${randomString}-${existingPdf.fileName}`;
  const filePath = `${userId}/signed/${fileName}`;

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
    throw new Error("Failed to upload signed PDF");
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

  // Update document's signed PDF reference and set currentStep to 4
  await prisma.document.update({
    where: { id: documentId },
    data: {
      signedPdfId: signedPdf.id,
      currentStep: 4,
    },
  });

  return {
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
  };
}
