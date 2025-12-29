/**
 * Document Service
 *
 * Business logic for document operations
 */

import { prisma } from "../db";
import { supabase } from "../storage";
import {
  getAllDocuments,
  getDocumentById,
  getDocumentWithContent,
  getDocumentWithSignatures,
} from "../queries/documents";
import {
  createDocument,
  updateDocument,
  createOrUpdateDocumentContent,
  updateDocumentCurrentPdf,
  updateDocumentSignedPdf,
} from "../mutations/documents";

/**
 * Helper function to generate public URL from PDF path
 */
function getPublicUrl(pdfPath: string | null): string | null {
  if (!pdfPath) return null;
  const { data } = supabase.storage.from("documents").getPublicUrl(pdfPath);
  return data.publicUrl;
}

/**
 * Get all documents for a user
 */
export async function getAllDocumentsForUser(userId: string) {
  return await getAllDocuments(userId);
}

/**
 * Get a single document by ID with ownership check and public URLs
 */
export async function getDocumentByIdForUser(
  documentId: string,
  userId: string
) {
  const document = await getDocumentById(documentId, userId);

  if (!document) {
    return null;
  }

  // Transform response to include public URL
  return {
    ...document,
    currentPdf: document.currentPdf
      ? {
          ...document.currentPdf,
          publicUrl: getPublicUrl(document.currentPdf.pdfPath),
        }
      : null,
    signedPdf: document.signedPdf
      ? {
          ...document.signedPdf,
          publicUrl: getPublicUrl(document.signedPdf.pdfPath),
        }
      : null,
  };
}

/**
 * Create a new document
 */
export async function createNewDocument(data: {
  ownerId: string;
  title: string;
  description: string;
  documentType: string;
}) {
  return await createDocument(data);
}

/**
 * Update document fields with ownership check
 */
export async function updateDocumentForUser(
  documentId: string,
  userId: string,
  data: {
    title?: string;
    description?: string;
    documentType?: string;
    sourceType?: string;
    currentStep?: number;
    subStep?: number;
    pdfPath?: string;
    currentPdfId?: string;
    signedPdfId?: string;
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

  const updatedDocument = await updateDocument(documentId, data);

  // Transform response to include public URL
  return {
    ...updatedDocument,
    currentPdf: updatedDocument.currentPdf
      ? {
          ...updatedDocument.currentPdf,
          publicUrl: getPublicUrl(updatedDocument.currentPdf.pdfPath),
        }
      : null,
    signedPdf: updatedDocument.signedPdf
      ? {
          ...updatedDocument.signedPdf,
          publicUrl: getPublicUrl(updatedDocument.signedPdf.pdfPath),
        }
      : null,
  };
}

/**
 * Save document content
 */
export async function saveDocumentContent(
  documentId: string,
  userId: string,
  htmlContent: string
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

  return await createOrUpdateDocumentContent(documentId, htmlContent);
}

/**
 * Get document content
 */
export async function getDocumentContentForUser(
  documentId: string,
  userId: string
) {
  const document = await getDocumentWithContent(documentId, userId);

  if (!document) {
    return null;
  }

  return document.currentContent;
}

/**
 * Get document with signatures
 */
export async function getDocumentSignaturesForUser(
  documentId: string,
  userId: string
) {
  const document = await getDocumentWithSignatures(documentId, userId);

  if (!document) {
    return null;
  }

  // Return signatures with public URLs
  return document.signatures.map((sig) => ({
    id: sig.id,
    imagePath: sig.imagePath,
    publicUrl: supabase.storage.from("signatures").getPublicUrl(sig.imagePath)
      .data.publicUrl,
    posX: sig.posX,
    posY: sig.posY,
    canvasPosX: sig.canvasPosX,
    canvasPosY: sig.canvasPosY,
    width: sig.width,
    height: sig.height,
    signerName: sig.signerName,
    signerPosition: sig.signerPosition,
    organization: sig.organization,
    pageNumber: sig.pageNumber,
    createdAt: sig.createdAt,
  }));
}

/**
 * Update document's current PDF reference
 */
export async function setCurrentPdf(documentId: string, pdfId: string) {
  return await updateDocumentCurrentPdf(documentId, pdfId);
}

/**
 * Update document's signed PDF reference and step
 */
export async function setSignedPdf(
  documentId: string,
  signedPdfId: string,
  currentStep: number
) {
  return await updateDocumentSignedPdf(documentId, signedPdfId, currentStep);
}
