/**
 * Document Workflow State Hook
 *
 * This hook manages all workflow state in a consolidated manner.
 * It provides a single source of truth for all workflow-related state.
 */

import { useState, useCallback, useEffect } from "react";
import { useGetDocument } from "./use-get-document";
import { GetDocumentResponse } from "../services";
import {
  DocumentWorkflowState,
  UseDocumentWorkflowStateOptions,
  UseDocumentWorkflowStateReturn,
} from "@/features/workflow";

/**
 * Custom hook for managing document workflow state
 *
 * @param options - Hook options including optional documentId
 * @returns Workflow state and update functions
 */
export function useDocumentWorkflowState({
  documentId: initialDocumentId,
}: UseDocumentWorkflowStateOptions): UseDocumentWorkflowStateReturn {
  // Use the created document ID if available, otherwise use the initial document ID
  const [createdDocumentId, setCreatedDocumentId] = useState<string | null>(
    initialDocumentId || null
  );

  const effectiveDocumentId = createdDocumentId || initialDocumentId;

  // Fetch document data using TanStack Query
  const { data: documentDataFetched } = useGetDocument(effectiveDocumentId);

  // Consolidated state object
  const [state, setState] = useState<DocumentWorkflowState>({
    // Step management
    currentStep: 1,
    subStep: 1,

    // Document data
    createdDocumentId: null, // Always start as null, separate from initialDocumentId for edit mode
    documentDataFetched: null,

    // Step 1 state
    step1FormState: null,

    // Step 2 state
    uploadMode: "upload",
    uploadedFile: null,

    // Step 3.1 state
    content: { html: "<p>Start typing your document...</p>" },

    // PDF state
    documentPdf: null,
    isGeneratingPdf: false,
    pdfGenerationError: null,

    // Step 3.2 state
    signatureImage: null,
    signatureData: null,
    signaturePosition: { x: 0, y: 0, page: 1 },
    signatureHistory: [],
    isPdfSigned: false,

    // Step 4 state
    finalPdfUrl: "",
    isSaving: false,
    saveStatus: "idle",

    // Error states
    documentCreationError: null,
    documentCreationSuccess: false,
    documentUpdateError: null,
    documentUpdateSuccess: false,
  });

  // Update state when document data is fetched
  useEffect(() => {
    if (documentDataFetched) {
      setState((prev) => {
        // Only update if we haven't initialized yet or if document ID changed
        if (
          !prev.documentDataFetched ||
          prev.documentDataFetched.id !== documentDataFetched.id
        ) {
          return {
            ...prev,
            currentStep: documentDataFetched.currentStep,
            subStep: documentDataFetched.subStep || 1,
            documentDataFetched,
            // Update isPdfSigned based on whether signedPdfId exists in database
            isPdfSigned: documentDataFetched.signedPdfId !== null,
          };
        }
        // Also update isPdfSigned if the signedPdfId changed
        if (
          prev.documentDataFetched &&
          prev.documentDataFetched.signedPdfId !==
            documentDataFetched.signedPdfId
        ) {
          return {
            ...prev,
            currentStep: documentDataFetched.currentStep,
            subStep: documentDataFetched.subStep || 1,
            documentDataFetched,
            isPdfSigned: documentDataFetched.signedPdfId !== null,
          };
        }
        return prev;
      });
    }
  }, [documentDataFetched]);

  /**
   * Update state with partial updates
   * This allows updating only specific parts of the state
   */
  const updateState = useCallback((updates: Partial<DocumentWorkflowState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };

      return newState;
    });
  }, []);

  /**
   * Update step with optional additional state updates
   * This is a convenience method for step transitions
   */
  const updateStep = useCallback(
    (step: number, updates?: Partial<DocumentWorkflowState>) => {
      setState((prev) => {
        const newState = { ...prev, currentStep: step, ...updates };

        if (process.env.NODE_ENV === "development") {
          console.log("[Workflow Step Updated]", step, updates, newState);
        }

        return newState;
      });
    },
    []
  );

  /**
   * Set created document ID
   * This is a convenience method for setting the document ID after creation
   * Updates both the local state and the workflow state atomically
   */
  const setDocumentId = useCallback((id: string) => {
    setCreatedDocumentId(id);
    // Use updateState directly instead of relying on useEffect
    // This ensures atomic update and avoids race conditions
    setState((prev) => ({
      ...prev,
      createdDocumentId: id,
    }));
  }, []);

  return {
    state,
    updateState,
    updateStep,
    setDocumentId,
  };
}
