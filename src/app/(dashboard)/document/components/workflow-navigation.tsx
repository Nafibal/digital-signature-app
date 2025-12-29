"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface WorkflowNavigationProps {
  currentStep: number;
  subStep: number;
  canProceed: boolean;
  isSaving: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onSaveSignedDocument: () => void;
  onCancel: () => void;
}

export default function WorkflowNavigation({
  currentStep,
  subStep,
  canProceed,
  isSaving,
  saveStatus,
  onPrevious,
  onNext,
  onSaveDraft,
  onSaveSignedDocument,
  onCancel,
}: WorkflowNavigationProps) {
  const isLastStep = currentStep === 4;
  const isFirstStep = currentStep === 1;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Cancel and Previous Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="gap-2"
        >
          Dashboard
        </Button>
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        )}
      </div>

      {/* Right: Save and Next Buttons */}
      <div className="flex flex-wrap gap-3">
        {!isLastStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving && saveStatus === "saving" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving && saveStatus === "saving" ? "Saving..." : "Save Draft"}
          </Button>
        )}

        {!isLastStep && (
          <Button
            type="button"
            onClick={onNext}
            disabled={!canProceed}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {isLastStep && (
          <Button
            type="button"
            onClick={onSaveSignedDocument}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving && saveStatus === "saving" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            {isSaving && saveStatus === "saving"
              ? "Saving..."
              : "Save Signed Document"}
          </Button>
        )}
      </div>

      {/* Save Status Toast */}
      {saveStatus === "saved" && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800 shadow-lg">
          <CheckCircle2 className="h-4 w-4" />
          <span>Saved successfully</span>
        </div>
      )}
    </div>
  );
}
