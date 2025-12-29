/**
 * Document Mutations
 *
 * Write operations for documents in the database
 */

import { prisma } from "../db";
import { DocumentStatus } from "../../lib/generated/prisma";

/**
 * Create a new document
 */
export async function createDocument(data: {
  ownerId: string;
  title: string;
  description: string;
  documentType: string;
}) {
  return await prisma.document.create({
    data: {
      ownerId: data.ownerId,
      title: data.title,
      description: data.description,
      documentType: data.documentType,
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
}

/**
 * Update document fields
 */
export async function updateDocument(
  documentId: string,
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
  return await prisma.document.update({
    where: {
      id: documentId,
    },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.documentType !== undefined && {
        documentType: data.documentType,
      }),
      ...(data.sourceType !== undefined && {
        sourceType: data.sourceType,
      }),
      ...(data.currentStep !== undefined && {
        currentStep: data.currentStep,
      }),
      ...(data.subStep !== undefined && {
        subStep: data.subStep,
      }),
      ...(data.pdfPath !== undefined && {
        pdfPath: data.pdfPath,
      }),
      ...(data.currentPdfId !== undefined && {
        currentPdfId: data.currentPdfId,
      }),
      ...(data.signedPdfId !== undefined && {
        signedPdfId: data.signedPdfId,
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
 * Create or update document content
 */
export async function createOrUpdateDocumentContent(
  documentId: string,
  htmlContent: string
) {
  // Check if document already has content
  const documentWithContent = await prisma.document.findUnique({
    where: { id: documentId },
    select: { currentContentId: true },
  });

  let content;

  if (documentWithContent?.currentContentId) {
    // Update existing content
    content = await prisma.documentContent.update({
      where: { id: documentWithContent.currentContentId },
      data: {
        htmlContent: htmlContent,
      },
    });
  } else {
    // Create new content (first time)
    content = await prisma.documentContent.create({
      data: {
        documentId,
        htmlContent: htmlContent,
        version: 1,
      },
    });

    // Update document's current content reference
    await prisma.document.update({
      where: { id: documentId },
      data: { currentContentId: content.id },
    });
  }

  return content;
}

/**
 * Create document PDF record
 */
export async function createDocumentPdf(data: {
  documentId: string;
  pdfPath: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  status: string;
}) {
  return await prisma.documentPdf.create({
    data: {
      documentId: data.documentId,
      pdfPath: data.pdfPath,
      fileName: data.fileName,
      fileSize: data.fileSize,
      pageCount: data.pageCount,
      status: data.status,
    },
  });
}

/**
 * Update document's current PDF reference
 */
export async function updateDocumentCurrentPdf(
  documentId: string,
  pdfId: string
) {
  return await prisma.document.update({
    where: { id: documentId },
    data: { currentPdfId: pdfId },
  });
}

/**
 * Update document's signed PDF reference and step
 */
export async function updateDocumentSignedPdf(
  documentId: string,
  signedPdfId: string,
  currentStep: number
) {
  return await prisma.document.update({
    where: { id: documentId },
    data: {
      signedPdfId,
      currentStep,
    },
  });
}

/**
 * Create signature record
 */
export async function createSignature(data: {
  documentId: string;
  documentPdfId: string;
  imagePath: string;
  pageNumber: number;
  posX: number;
  posY: number;
  canvasPosX?: number;
  canvasPosY?: number;
  width: number;
  height: number;
  signerName: string;
  signerPosition: string;
  organization: string;
}) {
  return await prisma.signature.create({
    data,
  });
}

/**
 * Update signature record
 */
export async function updateSignature(
  signatureId: string,
  data: {
    imagePath: string;
    pageNumber: number;
    posX: number;
    posY: number;
    canvasPosX?: number;
    canvasPosY?: number;
    width: number;
    height: number;
    signerName: string;
    signerPosition: string;
    organization: string;
  }
) {
  return await prisma.signature.update({
    where: {
      id: signatureId,
    },
    data,
  });
}
