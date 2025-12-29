/**
 * Document Queries
 *
 * Read operations for documents from the database
 */

import { prisma } from "../db";

/**
 * Get all documents for a user
 */
export async function getAllDocuments(userId: string) {
  return await prisma.document.findMany({
    where: {
      ownerId: userId,
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
}

/**
 * Get a single document by ID with ownership check
 */
export async function getDocumentById(documentId: string, userId: string) {
  return await prisma.document.findFirst({
    where: {
      id: documentId,
      ownerId: userId,
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
      signedPdfId: true,
      signedPdf: {
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
}

/**
 * Get document with content
 */
export async function getDocumentWithContent(
  documentId: string,
  userId: string
) {
  return await prisma.document.findFirst({
    where: {
      id: documentId,
      ownerId: userId,
    },
    include: {
      currentContent: true,
    },
  });
}

/**
 * Get document with signatures
 */
export async function getDocumentWithSignatures(
  documentId: string,
  userId: string
) {
  return await prisma.document.findFirst({
    where: {
      id: documentId,
      ownerId: userId,
    },
    include: {
      signatures: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

/**
 * Get document PDF by ID with ownership check
 */
export async function getDocumentPdfById(
  pdfId: string,
  documentId: string,
  userId: string
) {
  return await prisma.documentPdf.findFirst({
    where: {
      id: pdfId,
      documentId,
      document: {
        ownerId: userId,
      },
    },
  });
}

/**
 * Get signature by document PDF ID
 */
export async function getSignatureByDocumentPdfId(documentPdfId: string) {
  return await prisma.signature.findFirst({
    where: {
      documentPdfId,
    },
  });
}

/**
 * Get document content ID
 */
export async function getDocumentContentId(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: { currentContentId: true },
  });
  return document?.currentContentId;
}
