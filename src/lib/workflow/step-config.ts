/**
 * Step Configuration
 *
 * This file provides a single source of truth for workflow step configuration.
 * Each step's metadata, validation rules, and navigation behavior is defined here.
 */

import { DocumentWorkflowState } from "@/lib/types/workflow";
import { validateStep3aFormData } from "@/lib/types/document";

export interface StepConfig {
  stepNumber: number;
  title: string;
  description: string;
  canProceed: (state: DocumentWorkflowState) => boolean;
  nextLabel: string | ((state: DocumentWorkflowState) => string);
  previousLabel: string;
  showPrevious: boolean;
}

/**
 * Configuration for all workflow steps
 * This provides centralized control over step behavior and validation
 */
export const STEP_CONFIG: Record<number, StepConfig> = {
  1: {
    stepNumber: 1,
    title: "Check Document Details",
    description: "Verify document information",
    canProceed: (state) =>
      state.step1FormState?.getValues().title.trim() !== "",
    nextLabel: "Upload Document",
    previousLabel: "Previous",
    showPrevious: false,
  },
  2: {
    stepNumber: 2,
    title: "Upload or Create",
    description: "Upload PDF or create new",
    canProceed: (state) =>
      state.uploadMode === "upload" ? state.uploadedFile !== null : true,
    nextLabel: "Fill Content",
    previousLabel: "Back to Check",
    showPrevious: true,
  },
  3: {
    stepNumber: 3,
    title: "Fill Content & Add Signature",
    description: "Edit document and add signature",
    canProceed: (state) => {
      if (state.subStep === 1)
        return state.content.html
          ? validateStep3aFormData(state.content)
          : false;
      if (state.subStep === 2)
        return state.signatureImage !== null && state.signatureData !== null;
      return false;
    },
    nextLabel: (state) =>
      state.subStep === 1 ? "Add Signature" : "Final Review",
    previousLabel: "Back to Upload",
    showPrevious: true,
  },
  4: {
    stepNumber: 4,
    title: "Final Review",
    description: "Review and save signed document",
    canProceed: () => true,
    nextLabel: "Save",
    previousLabel: "Back to Signature",
    showPrevious: true,
  },
};

/**
 * Get configuration for a specific step
 *
 * @param step - The step number (1-4)
 * @returns Step configuration or undefined if step doesn't exist
 *
 * @example
 * ```tsx
 * const stepConfig = getStepConfig(1);
 * console.log(stepConfig.title); // "Check Document Details"
 * console.log(stepConfig.canProceed(state)); // true/false
 * ```
 */
export function getStepConfig(step: number): StepConfig | undefined {
  return STEP_CONFIG[step];
}

/**
 * Get the next button label for a specific step
 *
 * @param step - The step number (1-4)
 * @param state - Current workflow state (for dynamic labels)
 * @returns The label for the next button
 *
 * @example
 * ```tsx
 * const nextLabel = getNextLabel(3, state);
 * console.log(nextLabel); // "Add Signature" or "Final Review"
 * ```
 */
export function getNextLabel(
  step: number,
  state: DocumentWorkflowState
): string {
  const config = getStepConfig(step);
  if (!config) return "Next";

  if (typeof config.nextLabel === "function") {
    return config.nextLabel(state);
  }
  return config.nextLabel;
}

/**
 * Check if the previous button should be shown for a step
 *
 * @param step - The step number (1-4)
 * @returns Whether the previous button should be visible
 *
 * @example
 * ```tsx
 * const showPrevious = shouldShowPrevious(1);
 * console.log(showPrevious); // false
 * ```
 */
export function shouldShowPrevious(step: number): boolean {
  const config = getStepConfig(step);
  return config?.showPrevious || false;
}
