/**
 * Step Handlers
 *
 * This file extracts step-specific logic from the main workflow component.
 * Each step's navigation and business logic is isolated in its own function,
 * making the code easier to test, maintain, and understand.
 */

import {
  CreateDocumentRequest,
  UpdateDocumentRequest,
} from "@/features/document";
import { DocumentWorkflowState } from "../types";

/**
 * Dependencies required by step handlers
 * These are injected to allow for testing and decoupling
 */
export interface StepHandlerDependencies {
  updateState: (updates: Partial<DocumentWorkflowState>) => void;
  updateStep: (step: number, updates?: Partial<DocumentWorkflowState>) => void;
  createDocument: (data: CreateDocumentRequest) => void;
  updateDocument: (data: { id: string } & Record<string, unknown>) => void;
  saveContent: (data: { documentId: string; htmlContent: string }) => void;
  resetDocumentCreation: () => void;
  resetDocumentUpdate: () => void;
}

/**
 * Type alias for update document data
 * Matches the type expected by useUpdateDocument mutation
 */
export type UpdateDocumentData = { id: string } & UpdateDocumentRequest;

/**
 * Step handler interface
 * Provides methods for navigating forward and backward
 */
export interface StepHandler {
  handleNext: () => Promise<void>;
  handlePrevious: () => void;
}

/**
 * Factory function to create a step handler
 *
 * This function creates a handler object with methods for navigating
 * through the workflow. The handler uses the current state and
 * injected dependencies to perform step-specific logic.
 *
 * @param state - Current workflow state
 * @param deps - Handler dependencies (state updaters, mutations, etc.)
 * @returns Step handler with handleNext and handlePrevious methods
 *
 * @example
 * ```tsx
 * const handler = createStepHandler(state, {
 *   updateState,
 *   updateStep,
 *   createDocument,
 *   updateDocument,
 *   saveContent,
 *   resetDocumentCreation,
 *   resetDocumentUpdate,
 * });
 *
 * await handler.handleNext();
 * handler.handlePrevious();
 * ```
 */
export function createStepHandler(
  state: DocumentWorkflowState,
  deps: StepHandlerDependencies
): StepHandler {
  return {
    handleNext: async () => {
      switch (state.currentStep) {
        case 1:
          await handleStep1(state, deps);
          break;
        case 2:
          await handleStep2(state, deps);
          break;
        case 3:
          await handleStep3(state, deps);
          break;
        case 4:
          await handleStep4(state, deps);
          break;
      }
    },
    handlePrevious: () => {
      handlePreviousStep(state, deps);
    },
  };
}

/**
 * Step 1: Document creation and update logic
 *
 * Handles three scenarios:
 * 1. Creating a new document
 * 2. Editing an existing document with changes
 * 3. Editing an existing document without changes (just proceed)
 *
 * @param state - Current workflow state
 * @param deps - Handler dependencies
 */
async function handleStep1(
  state: DocumentWorkflowState,
  deps: StepHandlerDependencies
): Promise<void> {
  // Scenario 1: Creating new document
  if (!state.createdDocumentId && !state.documentCreationSuccess) {
    deps.resetDocumentCreation();
    const currentValues = state.step1FormState?.getValues();
    if (currentValues) {
      deps.createDocument({
        title: currentValues.title,
        description: currentValues.description,
        documentType: currentValues.documentType,
      });
    }
    return;
  }

  // Scenario 2: Editing existing document with changes
  if (state.createdDocumentId && state.step1FormState?.isDirty) {
    deps.resetDocumentUpdate();
    const currentValues = state.step1FormState.getValues();
    deps.updateDocument({
      id: state.createdDocumentId,
      title: currentValues.title,
      description: currentValues.description,
      documentType: currentValues.documentType,
    });
    return;
  }

  // Scenario 3: Editing existing document without changes - just proceed
  if (state.createdDocumentId && !state.step1FormState?.isDirty) {
    deps.updateStep(2);
    return;
  }
}

/**
 * Step 2: Upload or create mode logic
 *
 * Handles document source type selection:
 * 1. Create mode: Update document with sourceType="blank"
 * 2. Upload mode: Placeholder for future implementation
 *
 * @param state - Current workflow state
 * @param deps - Handler dependencies
 */
async function handleStep2(
  state: DocumentWorkflowState,
  deps: StepHandlerDependencies
): Promise<void> {
  if (state.uploadMode === "create") {
    // Update document with create mode
    deps.resetDocumentUpdate();
    deps.updateDocument({
      id: state.createdDocumentId!,
      sourceType: "blank",
      currentStep: 3,
    });
  } else if (state.uploadMode === "upload") {
    // Upload mode - not implemented yet
    // Show error to user instead of silently proceeding
    deps.updateState({
      documentCreationError: new Error("Upload mode is not yet implemented"),
    });
    return;
  }

  // Proceed to Step 3
  deps.updateStep(3);
}

/**
 * Step 3: Content and signature logic
 *
 * Handles two sub-steps:
 * 1. Sub-step 3.1: Save HTML content, generate PDF, update document
 * 2. Sub-step 3.2: Navigate to step 4
 *
 * @param state - Current workflow state
 * @param deps - Handler dependencies
 */
async function handleStep3(
  state: DocumentWorkflowState,
  deps: StepHandlerDependencies
): Promise<void> {
  if (state.subStep === 1) {
    // Auto-save content and generate PDF before proceeding to signature step
    if (state.createdDocumentId) {
      let pdfGenerationSucceeded = false;

      try {
        deps.updateState({ isGeneratingPdf: true, pdfGenerationError: null });

        // 1. Save HTML content to database (with null check)
        if (state.content?.html) {
          await deps.saveContent({
            documentId: state.createdDocumentId,
            htmlContent: state.content.html,
          });
        } else {
          throw new Error("Document content is missing or empty");
        }

        // 2. Generate PDF and upload to Supabase
        const pdfResponse = await fetch(
          `/api/documents/${state.createdDocumentId}/generate-pdf`,
          {
            method: "POST",
          }
        );

        if (!pdfResponse.ok) {
          const errorData = await pdfResponse.json();
          throw new Error(errorData.message || "Failed to generate PDF");
        }

        const pdfResult = await pdfResponse.json();
        deps.updateState({ documentPdf: pdfResult });

        // 3. Update document with currentPdfId and subStep = 2
        await deps.updateDocument({
          id: state.createdDocumentId,
          currentPdfId: pdfResult.id,
          subStep: 2,
        });

        // NOTE: We don't need to invalidate the query here because:
        // 1. We already have complete PDF data from the generation API (pdfResult)
        // 2. Invalidating the query causes a race condition where it refetches before
        //    the database update completes, resulting in currentPdf being null
        // 3. The PDF state is already correctly set from pdfResult

        pdfGenerationSucceeded = true;
      } catch (error) {
        console.error("Failed to generate PDF or save content:", error);
        deps.updateState({
          pdfGenerationError:
            error instanceof Error ? error.message : "Failed to generate PDF",
        });
        // Still proceed even if PDF generation fails
      } finally {
        deps.updateState({ isGeneratingPdf: false });
      }

      // Only proceed to sub-step 2 if PDF generation succeeded
      if (pdfGenerationSucceeded) {
        deps.updateState({ subStep: 2 });
      }
    }
  } else {
    // Sub-step 2: Navigate to step 4
    deps.updateStep(4);
  }
}

/**
 * Step 4: Final review logic
 *
 * This step is primarily for display purposes.
 * The actual save logic is handled by handleSaveSignedDocument in the component.
 *
 * @param state - Current workflow state
 * @param deps - Handler dependencies
 */
async function handleStep4(
  state: DocumentWorkflowState,
  deps: StepHandlerDependencies
): Promise<void> {
  // Save signed document logic
  // This is handled by handleSaveSignedDocument in the component
  // Just navigate to dashboard
}

/**
 * Previous step navigation logic
 *
 * Handles backward navigation through the workflow:
 * - Step 3.2 → Step 3.1
 * - Step 3.1 → Step 2
 * - Step 2 → Step 1
 * - Step 1 (cannot go back)
 *
 * @param state - Current workflow state
 * @param deps - Handler dependencies
 */
function handlePreviousStep(
  state: DocumentWorkflowState,
  deps: StepHandlerDependencies
): void {
  if (state.currentStep === 3 && state.subStep === 2) {
    // Go back to sub-step 1
    deps.updateState({ subStep: 1 });
  } else if (state.currentStep > 1) {
    // Go back to previous step
    deps.updateState({ currentStep: state.currentStep - 1 });
  }
  // Step 1: Cannot go back
}
