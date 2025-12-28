/**
 * Workflow Validators Utility
 *
 * This file provides memoized validation logic for the document workflow.
 * Validation results are cached and only recalculated when dependencies change,
 * preventing unnecessary re-renders and improving performance.
 */

import { useMemo } from "react";
import { DocumentWorkflowState } from "@/lib/types/workflow";
import { validateStep3aFormData } from "@/lib/types/document";

export interface WorkflowValidators {
  isStep1Valid: boolean;
  isStep2Valid: boolean;
  isStep3aValid: boolean;
  isStep3bValid: boolean;
  canProceed: () => boolean;
}

/**
 * Memoized validation hook for workflow state
 *
 * This hook computes validation results for all workflow steps and memoizes them.
 * The validation results are only recalculated when the specified dependencies change.
 *
 * @param state - Current workflow state
 * @returns Validation results for all steps and a canProceed function
 *
 * @example
 * ```tsx
 * const validators = useWorkflowValidators(state);
 * const { canProceed } = validators;
 *
 * <Button disabled={!canProceed()}>Next</Button>
 * ```
 */
export function useWorkflowValidators(
  state: DocumentWorkflowState
): WorkflowValidators {
  return useMemo(() => {
    // Step 1: Check if title is not empty
    const isStep1Valid =
      state.step1FormState?.getValues().title.trim() !== "" || false;

    // Step 2: Check if file is uploaded (in upload mode)
    const isStep2Valid =
      state.uploadMode === "upload" ? state.uploadedFile !== null : true;

    // Step 3a: Check if content has meaningful HTML
    const isStep3aValid =
      state.content && state.content.html
        ? validateStep3aFormData(state.content)
        : false;

    // Step 3b: Check if signature is created and PDF is signed
    const isStep3bValid =
      state.signatureImage !== null &&
      state.signatureData !== null &&
      state.isPdfSigned === true;

    // Determine if user can proceed to next step based on current step
    const canProceed = () => {
      if (state.currentStep === 1) return isStep1Valid;
      if (state.currentStep === 2) return isStep2Valid;
      if (state.currentStep === 3 && state.subStep === 1) return isStep3aValid;
      if (state.currentStep === 3 && state.subStep === 2) return isStep3bValid;
      return true;
    };

    return {
      isStep1Valid,
      isStep2Valid,
      isStep3aValid,
      isStep3bValid,
      canProceed,
    };
  }, [
    state.step1FormState,
    state.uploadMode,
    state.uploadedFile,
    state.content,
    state.signatureImage,
    state.signatureData,
    state.isPdfSigned,
    state.currentStep,
    state.subStep,
  ]);
}
