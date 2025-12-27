"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  DocumentPdfResponse,
  validateStep3aFormData,
} from "@/lib/types/document";
import { useCreateDocument } from "@/lib/hooks/use-create-document";
import { useGetContent } from "@/lib/hooks/use-get-content";
import { useGetDocument } from "@/lib/hooks/use-get-document";
import { useUpdateDocument } from "@/lib/hooks/use-update-document";
import { useSaveContent } from "@/lib/hooks/use-save-content";

type Session = typeof import("@/lib/auth").auth.$Infer.Session;

export default function DocumentWorkflowClient({
  session,
  documentId,
}: {
  session: Session;
  documentId?: string;
}) {
  const router = useRouter();
  const user = session.user;

  // Fetch document data if editing an existing document
  const { data: documentDataFetched, isLoading: isDocumentLoading } =
    useGetDocument(documentId);

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [subStep, setSubStep] = useState(1); // 1 or 2 for Step 3
  const [createdDocumentId, setCreatedDocumentId] = useState<string | null>(
    documentId || null
  );
  const [documentCreationError, setDocumentCreationError] =
    useState<Error | null>(null);
  const [documentCreationSuccess, setDocumentCreationSuccess] = useState(false);
  const [documentUpdateError, setDocumentUpdateError] = useState<Error | null>(
    null
  );
  const [documentUpdateSuccess, setDocumentUpdateSuccess] = useState(false);

  // Track Step 1 form state (isDirty and getValues)
  const [step1FormState, setStep1FormState] = useState<{
    isDirty: boolean;
    getValues: () => Step1FormData;
  } | null>(null);

  // Step 2: Upload/Create
  const [uploadMode, setUploadMode] = useState<"upload" | "create">("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Step 3.1: Fill Content - Using HTML structure
  const [content, setContent] = useState<Step3aFormData>({
    html: "<p>Start typing your document...</p>",
  });

  // PDF generation state
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfGenerationError, setPdfGenerationError] = useState<string | null>(
    null
  );
  const [documentPdf, setDocumentPdf] = useState<DocumentPdfResponse | null>(
    null
  );

  // Step 3.2: Add Signature
  const [signature, setSignature] = useState<string | null>(null);
  const [signaturePosition, setSignaturePosition] = useState<SignaturePosition>(
    {
      x: 0,
      y: 0,
      page: 1,
    }
  );
  const [signatureHistory, setSignatureHistory] = useState<string[]>([]);

  // Step 4: Final Review
  const [finalPdfUrl, setFinalPdfUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // Track if we've initialized state from fetched document
  const hasInitialized = useRef(false);

  // Track if content has been initialized from draft
  const hasInitializedContent = useRef(false);

  // Fetch document content
  const { data: contentData, isLoading: isContentLoading } = useGetContent(
    documentId || createdDocumentId
  );

  // Initialize state from fetched document data (only on first load)
  useEffect(() => {
    if (documentDataFetched && !hasInitialized.current) {
      // Initialize currentStep from document's currentStep
      setCurrentStep(documentDataFetched.currentStep);

      // Initialize subStep if available (for step 3 documents)
      if (
        documentDataFetched.currentStep === 3 &&
        documentDataFetched.subStep
      ) {
        setSubStep(documentDataFetched.subStep);
      }

      hasInitialized.current = true;
    }
  }, [documentDataFetched]);

  // Initialize content from fetched document content
  useEffect(() => {
    if (contentData?.content && !hasInitializedContent.current) {
      const fetchedContent = contentData.content;
      if (fetchedContent.htmlContent) {
        setContent({
          html: fetchedContent.htmlContent,
        });
        hasInitializedContent.current = true;
      }
    }
  }, [contentData]);

  // Initialize PDF data from fetched document
  useEffect(() => {
    if (documentDataFetched?.currentPdf) {
      setDocumentPdf(documentDataFetched.currentPdf as DocumentPdfResponse);
    }
  }, [documentDataFetched]);

  // Reset content initialization flag when document changes
  useEffect(() => {
    hasInitializedContent.current = false;
  }, [documentId, createdDocumentId]);

  const handleSignOut = async () => {
    router.push("/login");
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  const handlePrevious = () => {
    if (currentStep === 3 && subStep === 2) {
      setSubStep(1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Use the create document mutation
  const {
    mutate: createDocument,
    isLoading: isCreatingDocument,
    error: createDocumentError,
    isSuccess: createDocumentSuccess,
    reset: resetDocumentCreation,
  } = useCreateDocument({
    onSuccess: (data) => {
      setCreatedDocumentId(data.id);
      setDocumentCreationSuccess(true);
      setDocumentCreationError(null);
      // Automatically proceed to step 2 after document is created
      setCurrentStep(2);
    },
    onError: (error) => {
      setDocumentCreationError(error);
      setDocumentCreationSuccess(false);
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
      setDocumentUpdateSuccess(true);
      setDocumentUpdateError(null);
      // Only proceed to step 2 if we're on step 1
      // For step 2 and 3, navigation is handled separately
      if (currentStep === 1) {
        setCurrentStep(2);
      }
    },
    onError: (error) => {
      setDocumentUpdateError(error);
      setDocumentUpdateSuccess(false);
    },
  });

  // Initialize hooks
  const { mutate: saveContent } = useSaveContent();

  // Reset update success state after 2 seconds
  useEffect(() => {
    if (documentUpdateSuccess) {
      const timer = setTimeout(() => {
        setDocumentUpdateSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [documentUpdateSuccess]);

  const handleNext = async () => {
    // Step 1 logic
    if (currentStep === 1) {
      // Scenario 1: Creating new document
      if (!createdDocumentId && !documentCreationSuccess) {
        resetDocumentCreation();
        const currentValues = step1FormState?.getValues();
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
      if (createdDocumentId && step1FormState?.isDirty) {
        resetDocumentUpdate();
        const currentValues = step1FormState.getValues();
        updateDocument({
          id: createdDocumentId,
          title: currentValues.title,
          description: currentValues.description,
          documentType: currentValues.documentType,
        });
        return;
      }

      // Scenario 3: Editing existing document without changes - just proceed
      if (createdDocumentId && !step1FormState?.isDirty) {
        setCurrentStep(2);
        return;
      }
    }

    // Step 2 logic (NEW)
    if (currentStep === 2) {
      if (uploadMode === "create") {
        // Update document with create mode
        resetDocumentUpdate();
        updateDocument({
          id: createdDocumentId!,
          sourceType: "blank",
          currentStep: 3,
        });
      } else if (uploadMode === "upload") {
        // Upload mode - not implemented in this scenario
        // Just proceed to step 3
        setCurrentStep(3);
        return;
      }

      // Proceed to Step 3
      setCurrentStep(3);
      return;
    }

    // Normal navigation for other steps
    if (currentStep === 3 && subStep === 1) {
      // Auto-save content and generate PDF before proceeding to signature step
      if (createdDocumentId) {
        try {
          setIsGeneratingPdf(true);
          setPdfGenerationError(null);

          // 1. Save HTML content to database
          await saveContent({
            documentId: createdDocumentId,
            htmlContent: content.html,
          });

          // 2. Generate PDF and upload to Supabase
          const pdfResponse = await fetch(
            `/api/documents/${createdDocumentId}/generate-pdf`,
            {
              method: "POST",
            }
          );

          if (!pdfResponse.ok) {
            const errorData = await pdfResponse.json();
            throw new Error(errorData.message || "Failed to generate PDF");
          }

          const pdfResult = (await pdfResponse.json()) as DocumentPdfResponse;
          setDocumentPdf(pdfResult);

          // 3. Update document with currentPdfId and subStep = 2
          await updateDocument({
            id: createdDocumentId,
            currentPdfId: pdfResult.id,
            subStep: 2,
          });
        } catch (error) {
          console.error("Failed to generate PDF or save content:", error);
          setPdfGenerationError(
            error instanceof Error ? error.message : "Failed to generate PDF"
          );
          // Still proceed even if PDF generation fails
        } finally {
          setIsGeneratingPdf(false);
        }
      }
      setSubStep(2);
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSaveDraft = async () => {
    if (!createdDocumentId) return;

    setIsSaving(true);
    setSaveStatus("saving");

    try {
      // Save content with current HTML
      await saveContent({
        documentId: createdDocumentId,
        htmlContent: content.html,
      });

      setIsSaving(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to save draft:", error);
      setIsSaving(false);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  const handleSaveSignedDocument = async () => {
    setIsSaving(true);
    setSaveStatus("saving");
    // Mock save delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus("saved");
      router.push("/dashboard");
    }, 1500);
  };

  // Validation functions
  const isStep1Valid = step1FormState?.getValues().title.trim() !== "" || false;

  const isStep2Valid = uploadMode === "upload" ? uploadedFile !== null : true;

  const isStep3aValid =
    content && content.html ? validateStep3aFormData(content) : false;

  const isStep3bValid = signature !== null;

  const canProceed = () => {
    if (currentStep === 1) return isStep1Valid;
    if (currentStep === 2) return isStep2Valid;
    if (currentStep === 3 && subStep === 1) return isStep3aValid;
    if (currentStep === 3 && subStep === 2) return isStep3bValid;
    return true;
  };

  // Show loading state while fetching document data
  if (isDocumentLoading) {
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
              onFormStateChange={setStep1FormState}
              isCreating={isCreatingDocument}
              isUpdating={isUpdatingDocument}
              error={documentCreationError || documentUpdateError}
              isSuccess={documentCreationSuccess || documentUpdateSuccess}
            />
          )}

          {currentStep === 2 && (
            <Step2Upload
              uploadMode={uploadMode}
              setUploadMode={setUploadMode}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
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
                  setContent={setContent}
                  documentId={createdDocumentId}
                />
              )}
            </>
          )}

          {currentStep === 3 && subStep === 2 && (
            <Step3AddSignature
              documentPdf={documentPdf}
              signature={signature}
              setSignature={setSignature}
              signaturePosition={signaturePosition}
              setSignaturePosition={setSignaturePosition}
              signatureHistory={signatureHistory}
              setSignatureHistory={setSignatureHistory}
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
              signature={signature}
              signaturePosition={signaturePosition}
              finalPdfUrl={finalPdfUrl}
            />
          )}
        </div>

        {/* Navigation Controls */}
        <WorkflowNavigation
          currentStep={currentStep}
          subStep={subStep}
          canProceed={canProceed()}
          isSaving={isSaving}
          saveStatus={saveStatus}
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
