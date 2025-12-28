"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { FileSignature, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkflowSteps from "@/app/dashboard/components/workflow-steps";
import Step3SubStepper from "./components/step-3-sub-stepper";
import Step1Check from "./components/step-1-check";
import Step2Upload from "./components/step-2-upload";
import Step3FillContent from "./components/step-3-fill-content";
import Step3AddSignature from "./components/step-3-add-signature";
import Step4FinalReview from "./components/step-4-final-review";
import WorkflowNavigation from "./components/workflow-navigation";
import {
  Step1FormData,
  Step3aFormData,
  Step3bFormData,
  SignaturePosition,
  validateStep3aFormData,
} from "@/lib/types/document";
import { useCreateDocument } from "@/lib/hooks/use-create-document";
import { useGetContent } from "@/lib/hooks/use-get-content";
import { useDocumentWorkflowState } from "@/lib/hooks/use-document-workflow-state";
import { useUpdateDocument } from "@/lib/hooks/use-update-document";
import { useSaveContent } from "@/lib/hooks/use-save-content";
import { useWorkflowValidators } from "@/lib/utils/workflow-validators";

type Session = typeof import("@/lib/auth").auth.$Infer.Session;

export default function DocumentWorkflowClient({
  session,
  documentId: initialDocumentId,
}: {
  session: Session;
  documentId?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = session.user;

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
    if (contentData?.content?.htmlContent) {
      updateState({
        content: {
          html: contentData.content.htmlContent,
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
  }, [documentDataFetched, state.documentPdf, updateState]);

  const handleSignOut = async () => {
    router.push("/login");
  };

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

  const setSignatureImageWrapper = (
    action: React.SetStateAction<string | null>
  ) => {
    if (typeof action === "function") {
      const result = action(signatureImage);
      updateState({ signatureImage: result });
    } else {
      updateState({ signatureImage: action });
    }
  };

  const setSignatureDataWrapper = (
    action: React.SetStateAction<Step3bFormData | null>
  ) => {
    if (typeof action === "function") {
      const result = action(signatureData);
      updateState({ signatureData: result });
    } else {
      updateState({ signatureData: action });
    }
  };

  const setSignaturePositionWrapper = (
    action: React.SetStateAction<SignaturePosition>
  ) => {
    if (typeof action === "function") {
      const result = action(signaturePosition);
      updateState({ signaturePosition: result });
    } else {
      updateState({ signaturePosition: action });
    }
  };

  const setSignatureHistoryWrapper = (
    action: React.SetStateAction<string[]>
  ) => {
    if (typeof action === "function") {
      const result = action(signatureHistory);
      updateState({ signatureHistory: result });
    } else {
      updateState({ signatureHistory: action });
    }
  };

  const handlePrevious = useCallback(() => {
    if (state.currentStep === 3 && state.subStep === 2) {
      updateState({ subStep: 1 });
    } else if (state.currentStep > 1) {
      updateState({ currentStep: state.currentStep - 1 });
    }
  }, [state.currentStep, state.subStep, updateState]);

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

  const handleNext = useCallback(async () => {
    // Step 1 logic
    if (state.currentStep === 1) {
      // Scenario 1: Creating new document
      if (!state.createdDocumentId && !state.documentCreationSuccess) {
        resetDocumentCreation();
        const currentValues = state.step1FormState?.getValues();
        if (currentValues) {
          createDocument({
            title: currentValues.title,
            description: currentValues.description,
            documentType: currentValues.documentType,
          });
        }
        return;
      }

      // Scenario 2: Editing existing document with changes
      if (state.createdDocumentId && state.step1FormState?.isDirty) {
        resetDocumentUpdate();
        const currentValues = state.step1FormState.getValues();
        updateDocument({
          id: state.createdDocumentId,
          title: currentValues.title,
          description: currentValues.description,
          documentType: currentValues.documentType,
        });
        return;
      }

      // Scenario 3: Editing existing document without changes - just proceed
      if (state.createdDocumentId && !state.step1FormState?.isDirty) {
        updateStep(2);
        return;
      }
    }

    // Step 2 logic (NEW)
    if (state.currentStep === 2) {
      if (state.uploadMode === "create") {
        // Update document with create mode
        resetDocumentUpdate();
        updateDocument({
          id: state.createdDocumentId!,
          sourceType: "blank",
          currentStep: 3,
        });
      } else if (state.uploadMode === "upload") {
        // Upload mode - not implemented in this scenario
        // Just proceed to step 3
        updateStep(3);
        return;
      }

      // Proceed to Step 3
      updateStep(3);
      return;
    }

    // Normal navigation for other steps
    if (state.currentStep === 3 && state.subStep === 1) {
      // Auto-save content and generate PDF before proceeding to signature step
      if (state.createdDocumentId) {
        try {
          updateState({ isGeneratingPdf: true, pdfGenerationError: null });

          // 1. Save HTML content to database
          await saveContent({
            documentId: state.createdDocumentId,
            htmlContent: state.content.html,
          });

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
          updateState({ documentPdf: pdfResult });

          // 3. Update document with currentPdfId and subStep = 2
          await updateDocument({
            id: state.createdDocumentId,
            currentPdfId: pdfResult.id,
            subStep: 2,
          });

          // NOTE: We don't need to invalidate the query here because:
          // 1. We already have complete PDF data from the generation API (pdfResult)
          // 2. Invalidating the query causes a race condition where it refetches before
          //    the database update completes, resulting in currentPdf being null
          // 3. The PDF state is already correctly set from pdfResult
        } catch (error) {
          console.error("Failed to generate PDF or save content:", error);
          updateState({
            pdfGenerationError:
              error instanceof Error ? error.message : "Failed to generate PDF",
          });
          // Still proceed even if PDF generation fails
        } finally {
          updateState({ isGeneratingPdf: false });
        }
      }
      updateState({ subStep: 2 });
    } else if (state.currentStep < 4) {
      updateStep(state.currentStep + 1);
    }
  }, [
    state.currentStep,
    state.subStep,
    state.createdDocumentId,
    state.documentCreationSuccess,
    state.step1FormState,
    state.uploadMode,
    state.content,
    updateState,
    updateStep,
    resetDocumentCreation,
    createDocument,
    resetDocumentUpdate,
    updateDocument,
    saveContent,
  ]);

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

  const handleSaveSignedDocument = useCallback(async () => {
    updateState({ isSaving: true, saveStatus: "saving" });
    // Mock save delay
    setTimeout(() => {
      updateState({ isSaving: false, saveStatus: "saved" });
      router.push("/dashboard");
    }, 1500);
  }, [updateState, router]);

  // Use memoized validation hook
  const validators = useWorkflowValidators(state);
  const { canProceed } = validators;

  // Show loading state while fetching document data
  if (!documentDataFetched && initialDocumentId) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            {/* Logo */}
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white">
                <FileSignature className="h-5 w-5" />
              </div>
              <span>DigiSign.</span>
            </div>

            {/* User Info & Sign Out */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-neutral-100 md:flex">
                  <User className="h-4 w-4 text-neutral-600" />
                </div>
                <span className="hidden text-sm font-medium text-neutral-700 md:block">
                  {user.name || user.email}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Loading State */}
        <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 md:px-6 md:py-12">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 mx-auto" />
            <p className="text-neutral-600">Loading document...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white">
              <FileSignature className="h-5 w-5" />
            </div>
            <span>DigiSign.</span>
          </div>

          {/* User Info & Sign Out */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-neutral-100 md:flex">
                <User className="h-4 w-4 text-neutral-600" />
              </div>
              <span className="hidden text-sm font-medium text-neutral-700 md:block">
                {user.name || user.email}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

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
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 mx-auto" />
                    <p className="text-sm text-neutral-600">
                      Loading saved content...
                    </p>
                  </div>
                </div>
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
              finalPdfUrl={finalPdfUrl}
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
          onSaveSignedDocument={handleSaveSignedDocument}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}
