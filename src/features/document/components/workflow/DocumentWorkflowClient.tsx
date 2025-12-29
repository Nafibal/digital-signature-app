"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import WorkflowSteps from "./WorkflowSteps";
import Step3SubStepper from "../step-3-sub-stepper";
import Step1Check from "../step-1-check";
import Step2Upload from "../step-2-upload";
import Step3FillContent from "../step-3-fill-content";
import Step3AddSignature from "../step-3-add-signature";
import Step4FinalReview from "../step-4-final-review";
import WorkflowNavigation from "../workflow-navigation";
import { LoadingState } from "@/components/feedback/LoadingState";
import {
  Step1FormData,
  Step3aFormData,
  Step3bFormData,
  SignaturePosition,
  validateStep3aFormData,
} from "@/features/document/types";
import { useCreateDocument } from "@/features/document/hooks/use-create-document";
import { useGetContent } from "@/features/document/hooks/use-get-content";
import { useDocumentWorkflowState } from "@/features/document/hooks/use-document-workflow-state";
import { useUpdateDocument } from "@/features/document/hooks/use-update-document";
import { useSaveContent } from "@/features/document/hooks/use-save-content";
import { useWorkflowValidators } from "@/features/workflow/hooks/use-workflow-validators";
import { createStepHandler } from "@/features/workflow/services/step-handlers";
import type { Session } from "@/features/auth/types";

export default function DocumentWorkflowClient({
  session,
  documentId: initialDocumentId,
}: {
  session: Session;
  documentId?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Consolidated state management
  const { state, updateState, updateStep, setDocumentId } =
    useDocumentWorkflowState({
      documentId: initialDocumentId,
    });

  const {
    currentStep,
    subStep,
    createdDocumentId,
    documentDataFetched,
    step1FormState,
    uploadMode,
    uploadedFile,
    content,
    documentPdf,
    isGeneratingPdf,
    pdfGenerationError,
    signatureImage,
    signatureData,
    signaturePosition,
    signatureHistory,
    finalPdfUrl,
    isSaving,
    saveStatus,
    documentCreationError,
    documentCreationSuccess,
    documentUpdateError,
    documentUpdateSuccess,
  } = state;

  const effectiveDocumentId = createdDocumentId || initialDocumentId;

  // Use refs to store current state values for functional updates
  // This prevents wrapper functions from being recreated when state changes
  const signatureImageRef = useRef(signatureImage);
  const signatureDataRef = useRef(signatureData);
  const signaturePositionRef = useRef(signaturePosition);
  const signatureHistoryRef = useRef(signatureHistory);

  // Update refs when state changes
  useEffect(() => {
    signatureImageRef.current = signatureImage;
  }, [signatureImage]);

  useEffect(() => {
    signatureDataRef.current = signatureData;
  }, [signatureData]);

  useEffect(() => {
    signaturePositionRef.current = signaturePosition;
  }, [signaturePosition]);

  useEffect(() => {
    signatureHistoryRef.current = signatureHistory;
  }, [signatureHistory]);

  // Create stable callback for form state changes
  const handleFormStateChange = useCallback(
    (formState: { isDirty: boolean; getValues: () => Step1FormData }) => {
      updateState({ step1FormState: formState });
    },
    [updateState]
  );

  // Fetch document content
  const { data: contentData, isLoading: isContentLoading } = useGetContent(
    effectiveDocumentId || null
  );

  // Initialize content from fetched document content
  useEffect(() => {
    if (contentData?.htmlContent) {
      updateState({
        content: {
          html: contentData.htmlContent,
        },
      });
    }
  }, [contentData, updateState]);

  // Initialize PDF data from fetched document
  useEffect(() => {
    // Only initialize if:
    // 1. We have fetched data with currentPdf
    // 2. We don't already have documentPdf set (this is initial load)
    // 3. The document has a currentPdfId set (PDF was already generated)
    if (
      documentDataFetched?.currentPdf &&
      documentDataFetched.currentPdfId &&
      !state.documentPdf
    ) {
      updateState({
        documentPdf: documentDataFetched.currentPdf as {
          id: string;
          documentId: string;
          pdfPath: string;
          fileName: string;
          fileSize: number;
          pageCount?: number;
          status: string;
          publicUrl: string;
          createdAt: string;
          updatedAt: string;
        },
      });
    }

    // Update signed PDF URL when document is signed (runs on every refetch)
    if (documentDataFetched?.signedPdf) {
      const signedPdfUrl = documentDataFetched.signedPdf.publicUrl || "";
      if (signedPdfUrl) {
        updateState({
          finalPdfUrl: signedPdfUrl,
        });
      }
    }
  }, [documentDataFetched, updateState]);

  const handleCancel = () => {
    router.push("/dashboard");
  };

  // Create wrapper functions that match React.Dispatch<React.SetStateAction<T>>
  // These allow child components to work with our consolidated state
  const setUploadModeWrapper = (
    action: React.SetStateAction<"upload" | "create">
  ) => {
    if (typeof action === "function") {
      const result = action(uploadMode);
      updateState({ uploadMode: result });
    } else {
      updateState({ uploadMode: action });
    }
  };

  const setUploadedFileWrapper = (
    action: React.SetStateAction<File | null>
  ) => {
    if (typeof action === "function") {
      const result = action(uploadedFile);
      updateState({ uploadedFile: result });
    } else {
      updateState({ uploadedFile: action });
    }
  };

  const setContentWrapper = (action: React.SetStateAction<Step3aFormData>) => {
    if (typeof action === "function") {
      const result = action(content);
      updateState({ content: result });
    } else {
      updateState({ content: action });
    }
  };

  const setSignatureImageWrapper = useCallback(
    (action: React.SetStateAction<string | null>) => {
      if (typeof action === "function") {
        const result = action(signatureImageRef.current);
        updateState({ signatureImage: result });
      } else {
        updateState({ signatureImage: action });
      }
    },
    [updateState]
  );

  const setSignatureDataWrapper = useCallback(
    (action: React.SetStateAction<Step3bFormData | null>) => {
      if (typeof action === "function") {
        const result = action(signatureDataRef.current);
        updateState({ signatureData: result });
      } else {
        updateState({ signatureData: action });
      }
    },
    [updateState]
  );

  const setSignaturePositionWrapper = useCallback(
    (action: React.SetStateAction<SignaturePosition>) => {
      if (typeof action === "function") {
        const result = action(signaturePositionRef.current);
        updateState({ signaturePosition: result });
      } else {
        updateState({ signaturePosition: action });
      }
    },
    [updateState]
  );

  const setSignatureHistoryWrapper = useCallback(
    (action: React.SetStateAction<string[]>) => {
      if (typeof action === "function") {
        const result = action(signatureHistoryRef.current);
        updateState({ signatureHistory: result });
      } else {
        updateState({ signatureHistory: action });
      }
    },
    [updateState]
  );

  // Use the create document mutation
  const {
    mutate: createDocument,
    isLoading: isCreatingDocument,
    error: createDocumentError,
    isSuccess: createDocumentSuccess,
    reset: resetDocumentCreation,
  } = useCreateDocument({
    onSuccess: (data) => {
      setDocumentId(data.id);
      updateState({
        documentCreationSuccess: true,
        documentCreationError: null,
      });
      // Automatically proceed to step 2 after document is created
      updateStep(2);
    },
    onError: (error) => {
      updateState({
        documentCreationError: error,
        documentCreationSuccess: false,
      });
    },
  });

  // Use the update document mutation
  const {
    mutate: updateDocument,
    isLoading: isUpdatingDocument,
    error: updateDocumentError,
    isSuccess: updateDocumentSuccess,
    reset: resetDocumentUpdate,
  } = useUpdateDocument({
    onSuccess: (data) => {
      updateState({
        documentUpdateSuccess: true,
        documentUpdateError: null,
      });
      // Only proceed to step 2 if we're on step 1
      // For step 2 and 3, navigation is handled separately
      if (currentStep === 1) {
        updateStep(2);
      }
    },
    onError: (error) => {
      updateState({
        documentUpdateError: error,
        documentUpdateSuccess: false,
      });
    },
  });

  // Initialize hooks
  const { mutate: saveContent } = useSaveContent();

  // Reset update success state after 2 seconds
  useEffect(() => {
    if (documentUpdateSuccess) {
      const timer = setTimeout(() => {
        updateState({ documentUpdateSuccess: false });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [documentUpdateSuccess, updateState]);

  // Create step handler with all dependencies
  const stepHandler = useCallback(() => {
    return createStepHandler(state, {
      updateState,
      updateStep,
      createDocument,
      updateDocument,
      saveContent,
      resetDocumentCreation,
      resetDocumentUpdate,
    });
  }, [
    state,
    updateState,
    updateStep,
    createDocument,
    updateDocument,
    saveContent,
    resetDocumentCreation,
    resetDocumentUpdate,
  ]);

  // Simplified handleNext using step handler
  const handleNext = useCallback(async () => {
    const handler = stepHandler();
    await handler.handleNext();
  }, [stepHandler]);

  // Simplified handlePrevious using step handler
  const handlePrevious = useCallback(() => {
    const handler = stepHandler();
    handler.handlePrevious();
  }, [stepHandler]);

  const handlePdfSigned = useCallback(
    (signedPdfUrl: string) => {
      updateState({ finalPdfUrl: signedPdfUrl, isPdfSigned: true });
    },
    [updateState]
  );

  const handleProceedToStep4 = useCallback(() => {
    updateStep(4);
  }, [updateStep]);

  const handleSaveDraft = useCallback(async () => {
    if (!state.createdDocumentId) return;

    updateState({ isSaving: true, saveStatus: "saving" });

    try {
      // Save content with current HTML
      await saveContent({
        documentId: state.createdDocumentId,
        htmlContent: state.content.html,
      });

      updateState({ isSaving: false, saveStatus: "saved" });
      setTimeout(() => updateState({ saveStatus: "idle" }), 2000);
    } catch (error) {
      console.error("Failed to save draft:", error);
      updateState({ isSaving: false, saveStatus: "error" });
      setTimeout(() => updateState({ saveStatus: "idle" }), 2000);
    }
  }, [state.createdDocumentId, state.content, updateState, saveContent]);

  const handleDownloadPdf = useCallback(() => {
    if (!state.finalPdfUrl || state.finalPdfUrl.length === 0) {
      console.error("No signed PDF available for download");
      return;
    }

    // Create download link
    const link = document.createElement("a");
    link.href = state.finalPdfUrl;
    link.download = `signed-document-${Date.now()}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.finalPdfUrl]);

  // Use memoized validation hook
  const validators = useWorkflowValidators(state);
  const { canProceed } = validators;

  // Show loading state while fetching document data
  if (!documentDataFetched && initialDocumentId) {
    return (
      <div className="min-h-screen bg-white">
        <LoadingState message="Loading document..." fullScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        {/* Workflow Steps Indicator */}
        <div className="mb-8">
          <WorkflowSteps currentStep={currentStep} />
        </div>

        {/* Step 3 Sub-Stepper - Only visible when on step 3 */}
        {currentStep === 3 && (
          <div className="mb-6">
            <Step3SubStepper currentSubStep={subStep} />
          </div>
        )}

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && (
            <Step1Check
              defaultValues={
                documentDataFetched
                  ? {
                      title: documentDataFetched.title,
                      description: documentDataFetched.description || "",
                      documentType:
                        documentDataFetched.documentType || "contract",
                    }
                  : undefined
              }
              onFormStateChange={handleFormStateChange}
              isCreating={isCreatingDocument}
              isUpdating={isUpdatingDocument}
              error={documentCreationError || documentUpdateError}
              isSuccess={documentCreationSuccess || documentUpdateSuccess}
            />
          )}

          {currentStep === 2 && (
            <Step2Upload
              uploadMode={uploadMode}
              setUploadMode={setUploadModeWrapper}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFileWrapper}
              documentId={createdDocumentId}
              onNext={() => handleNext()}
            />
          )}

          {currentStep === 3 && subStep === 1 && (
            <>
              {isContentLoading ? (
                <LoadingState message="Loading saved content..." />
              ) : (
                <Step3FillContent
                  content={content}
                  setContent={setContentWrapper}
                  documentId={createdDocumentId}
                />
              )}
            </>
          )}

          {currentStep === 3 && subStep === 2 && (
            <Step3AddSignature
              documentId={createdDocumentId!}
              documentPdf={documentPdf}
              signatureImage={signatureImage}
              setSignatureImage={setSignatureImageWrapper}
              signatureData={signatureData}
              setSignatureData={setSignatureDataWrapper}
              signaturePosition={signaturePosition}
              setSignaturePosition={setSignaturePositionWrapper}
              signatureHistory={signatureHistory}
              setSignatureHistory={setSignatureHistoryWrapper}
              onPdfSigned={handlePdfSigned}
              onProceedToStep4={handleProceedToStep4}
            />
          )}

          {currentStep === 4 && (
            <Step4FinalReview
              documentData={
                documentDataFetched
                  ? {
                      title: documentDataFetched.title,
                      description: documentDataFetched.description || "",
                      documentType:
                        documentDataFetched.documentType || "contract",
                    }
                  : {
                      title: "",
                      description: "",
                      documentType: "contract",
                    }
              }
              signature={signatureImage}
              signaturePosition={signaturePosition}
              documentDataFetched={documentDataFetched}
            />
          )}
        </div>

        {/* Navigation Controls */}
        <WorkflowNavigation
          currentStep={state.currentStep}
          subStep={state.subStep}
          canProceed={validators.canProceed()}
          isSaving={state.isSaving}
          saveStatus={state.saveStatus}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSaveDraft={handleSaveDraft}
          onDownloadPdf={handleDownloadPdf}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}
