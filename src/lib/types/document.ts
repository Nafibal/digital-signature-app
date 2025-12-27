/**
 * Document Workflow Types
 *
 * This file contains type definitions for the document workflow feature.
 * These types align with the Prisma schema and are used across the application.
 */

/**
 * Tiptap JSON Types
 * Represents the structure of Tiptap editor content
 */
export interface TiptapJson extends Record<string, unknown> {
  type: string;
  content?: TiptapNode[];
  attrs?: Record<string, unknown>;
}

export interface TiptapNode {
  type: string;
  content?: TiptapNode[];
  text?: string;
  marks?: TiptapMark[];
  attrs?: Record<string, unknown>;
}

export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

/**
 * Document Status Enum
 * Matches the DocumentStatus enum in Prisma schema
 */
export type DocumentStatus = "draft" | "signed";

/**
 * Document Type Enum
 * Common document types supported by the application
 */
export type DocumentType = "contract" | "nda" | "invoice" | "other";

/**
 * Step 1: Check Document Details Form Data
 * Collected in step-1-check.tsx
 * Maps to Document model fields
 */
export interface Step1FormData {
  title: string; // Maps to Document.title
  documentType: string; // Maps to Document.documentType
  description: string; // Maps to Document.description
}

/**
 * Step 2: Upload/Create Document Data
 * Collected in step-2-upload.tsx
 * Maps to DocumentDraft model fields
 */
export interface Step2FormData {
  uploadMode: "upload" | "create";
  uploadedFile: File | null; // Will be stored as pdfPath in DocumentDraft
}

/**
 * Step 3a: Fill Content Data
 * Collected in step-3-fill-content.tsx
 * Maps to DocumentContent.contentJson
 */
export interface Step3aFormData {
  body: TiptapJson; // Part of contentJson
}

/**
 * Step 3b: Add Signature Data
 * Collected in step-3-add-signature.tsx
 * Maps to Signature model fields
 */
export interface Step3bFormData {
  organization: string; // Maps to Signature.organization
  signerName: string; // Maps to Signature.signerName
  position: string; // Maps to Signature.signerPosition
}

/**
 * Signature Position Data
 * Collected in step-3-add-signature.tsx
 * Maps to Signature model fields
 */
export interface SignaturePosition {
  x: number; // Maps to Signature.posX
  y: number; // Maps to Signature.posY
  page: number; // Maps to Signature.pageNumber
}

/**
 * Complete Signature Data
 * Combines signature metadata and position
 * Maps to Signature model
 */
export interface SignatureData {
  organization: string; // Maps to Signature.organization
  signerName: string; // Maps to Signature.signerName
  signerPosition: string; // Maps to Signature.signerPosition
  position: SignaturePosition;
  imagePath?: string; // Maps to Signature.imagePath (optional for now)
  width?: number; // Maps to Signature.width (optional for now)
  height?: number; // Maps to Signature.height (optional for now)
}

/**
 * Document Content JSON Structure
 * Stored in DocumentContent.contentJson
 * Matches the structure used in step-3-fill-content.tsx
 */
export interface DocumentContentJson {
  title: TiptapJson;
  body: TiptapJson;
  footer: TiptapJson;
}

/**
 * Complete Document Data
 * Aggregates all data collected across workflow steps
 * Maps to Document, DocumentContent, DocumentDraft, and Signature models
 */
export interface DocumentWorkflowData {
  // Document metadata (Step 1)
  title: string;
  description: string;
  documentType: string;

  // Document draft (Step 2)
  uploadMode: "upload" | "create";
  uploadedFile: File | null;
  selectedTemplate: string | null;

  // Document content (Step 3a)
  content: {
    title: string;
    body: string;
    footer: string;
  };

  // Signature (Step 3b)
  signature: {
    organization: string;
    signerName: string;
    position: string;
  };
  signaturePosition: {
    x: number;
    y: number;
    page: number;
  };

  // Workflow state
  currentStep: number;
  subStep: number;
}

/**
 * Default Organizations
 * Available for signature creation
 */
export const DEFAULT_ORGANIZATIONS = [
  "Finance Department",
  "HR Department",
  "IT Department",
  "Operations",
  "Legal Department",
];

/**
 * Document Type Labels
 * Maps document type codes to human-readable labels
 */
export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  contract: "Contract Agreement",
  nda: "Non-Disclosure Agreement",
  invoice: "Invoice",
  other: "Other",
};

/**
 * Workflow Step Labels
 * Maps step numbers to human-readable labels
 */
export const WORKFLOW_STEP_LABELS: Record<number, string> = {
  1: "Check Document Details",
  2: "Upload or Create Document",
  3: "Fill Content & Add Signature",
  4: "Final Review",
};

/**
 * Validation Helpers
 */

/**
 * Validates Step 1 form data
 */
export function validateStep1FormData(data: Step1FormData): boolean {
  return data.title.trim() !== "";
}

/**
 * Validates Step 2 form data
 */
export function validateStep2FormData(data: Step2FormData): boolean {
  if (data.uploadMode === "upload") {
    return data.uploadedFile !== null;
  } else {
    // "create" mode is always valid (no template selection required)
    return true;
  }
}

/**
 * Validates Step 3a form data
 */
export function validateStep3aFormData(data: Step3aFormData): boolean {
  // Check if title and body have content
  const hasContent = (tiptapJson: TiptapJson): boolean => {
    if (!tiptapJson.content || tiptapJson.content.length === 0) {
      return false;
    }
    // Check if any node has text content
    return tiptapJson.content.some((node) => {
      if (node.text && node.text.trim() !== "") {
        return true;
      }
      if (node.content) {
        return hasContent({ type: "doc", content: node.content });
      }
      return false;
    });
  };

  return hasContent(data.body);
}

/**
 * Validates Step 3b form data
 */
export function validateStep3bFormData(data: Step3bFormData): boolean {
  return (
    data.organization.trim() !== "" &&
    data.signerName.trim() !== "" &&
    data.position.trim() !== ""
  );
}

/**
 * Document Content Response
 * Response from /api/documents/[id]/content
 */
export interface DocumentContentResponse {
  content: {
    id: string;
    documentId: string;
    contentJson: Record<string, unknown>;
    htmlContent: string | null;
    previewPdfPath: string | null;
    version: number;
    createdAt: string;
    updatedAt: string;
  } | null;
}

/**
 * PDF Preview Response
 * Response from /api/documents/[id]/preview
 * Returns PDF bytes directly as ArrayBuffer
 */
export interface PDFPreviewResponse {
  pdfBytes: ArrayBuffer;
}
