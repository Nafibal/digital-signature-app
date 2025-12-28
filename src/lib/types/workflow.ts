/**
 * Workflow State Types
 *
 * This file defines all TypeScript types related to document workflow state management.
 * These types provide a single source of truth for the workflow state structure.
 */

import {
  Step1FormData,
  Step3aFormData,
  Step3bFormData,
  SignaturePosition,
  DocumentPdfResponse,
} from "./document";
import { GetDocumentResponse } from "@/lib/api/documents";

/**
 * Step 1 form state wrapper
 * Encapsulates form state from react-hook-form
 */
export interface Step1FormState {
  isDirty: boolean;
  getValues: () => Step1FormData;
}

/**
 * Main document workflow state
 * Consolidates all workflow-related state into a single object
 */
export interface DocumentWorkflowState {
  // Step management
  currentStep: number;
  subStep: number;

  // Document data
  createdDocumentId: string | null;
  documentDataFetched: GetDocumentResponse | null;

  // Step 1 state
  step1FormState: Step1FormState | null;

  // Step 2 state
  uploadMode: "upload" | "create";
  uploadedFile: File | null;

  // Step 3.1 state
  content: Step3aFormData;

  // PDF state
  documentPdf: DocumentPdfResponse | null;
  isGeneratingPdf: boolean;
  pdfGenerationError: string | null;

  // Step 3.2 state
  signatureImage: string | null;
  signatureData: Step3bFormData | null;
  signaturePosition: SignaturePosition;
  signatureHistory: string[];
  isPdfSigned: boolean;

  // Step 4 state
  finalPdfUrl: string;
  isSaving: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";

  // Error states
  documentCreationError: Error | null;
  documentCreationSuccess: boolean;
  documentUpdateError: Error | null;
  documentUpdateSuccess: boolean;
}

/**
 * Type for partial state updates
 * Allows updating only specific parts of the workflow state
 */
export type WorkflowStateUpdate = Partial<DocumentWorkflowState>;

/**
 * Options for useDocumentWorkflowState hook
 */
export interface UseDocumentWorkflowStateOptions {
  documentId?: string;
}

/**
 * Return type for useDocumentWorkflowState hook
 */
export interface UseDocumentWorkflowStateReturn {
  state: DocumentWorkflowState;
  updateState: (updates: WorkflowStateUpdate) => void;
  updateStep: (step: number, updates?: WorkflowStateUpdate) => void;
  setDocumentId: (id: string) => void;
}
