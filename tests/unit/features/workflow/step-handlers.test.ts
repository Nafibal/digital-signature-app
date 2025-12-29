import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createStepHandler,
  type StepHandlerDependencies,
} from "@/features/workflow/services/step-handlers";
import type { DocumentWorkflowState } from "@/features/workflow/types";

describe("createStepHandler", () => {
  let mockDeps: StepHandlerDependencies;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDeps = {
      updateState: vi.fn(),
      updateStep: vi.fn(),
      createDocument: vi.fn(),
      updateDocument: vi.fn(),
      saveContent: vi.fn(),
      resetDocumentCreation: vi.fn(),
      resetDocumentUpdate: vi.fn(),
    };
  });

  describe("handleNext - Step 1", () => {
    it("creates new document when no document exists", async () => {
      const state: DocumentWorkflowState = {
        currentStep: 1,
        subStep: 1,
        createdDocumentId: null,
        documentCreationSuccess: false,
        step1FormState: {
          isDirty: false,
          getValues: () => ({
            title: "Test",
            documentType: "contract",
            description: "Desc",
          }),
        },
        documentDataFetched: null,
        uploadMode: "create",
        uploadedFile: null,
        content: { html: "<p>Content</p>" },
        documentPdf: null,
        isGeneratingPdf: false,
        pdfGenerationError: null,
        signatureImage: null,
        signatureData: null,
        signaturePosition: { x: 0, y: 0, page: 1 },
        signatureHistory: [],
        isPdfSigned: false,
        finalPdfUrl: "",
        isSaving: false,
        saveStatus: "idle",
        documentCreationError: null,
        documentUpdateError: null,
        documentUpdateSuccess: false,
      };

      const handler = createStepHandler(state, mockDeps);
      await handler.handleNext();

      expect(mockDeps.resetDocumentCreation).toHaveBeenCalled();
      expect(mockDeps.createDocument).toHaveBeenCalledWith({
        title: "Test",
        description: "Desc",
        documentType: "contract",
      });
    });

    it("updates document when editing with changes", async () => {
      const state: DocumentWorkflowState = {
        currentStep: 1,
        subStep: 1,
        createdDocumentId: "doc-1",
        documentCreationSuccess: false,
        step1FormState: {
          isDirty: true,
          getValues: () => ({
            title: "Updated",
            documentType: "contract",
            description: "New Desc",
          }),
        },
        documentDataFetched: null,
        uploadMode: "create",
        uploadedFile: null,
        content: { html: "<p>Content</p>" },
        documentPdf: null,
        isGeneratingPdf: false,
        pdfGenerationError: null,
        signatureImage: null,
        signatureData: null,
        signaturePosition: { x: 0, y: 0, page: 1 },
        signatureHistory: [],
        isPdfSigned: false,
        finalPdfUrl: "",
        isSaving: false,
        saveStatus: "idle",
        documentCreationError: null,
        documentUpdateError: null,
        documentUpdateSuccess: false,
      };

      const handler = createStepHandler(state, mockDeps);
      await handler.handleNext();

      expect(mockDeps.resetDocumentUpdate).toHaveBeenCalled();
      expect(mockDeps.updateDocument).toHaveBeenCalledWith({
        id: "doc-1",
        title: "Updated",
        description: "New Desc",
        documentType: "contract",
      });
    });

    it("proceeds to step 2 when editing without changes", async () => {
      const state: DocumentWorkflowState = {
        currentStep: 1,
        subStep: 1,
        createdDocumentId: "doc-1",
        documentCreationSuccess: false,
        step1FormState: {
          isDirty: false,
          getValues: () => ({
            title: "Test",
            documentType: "contract",
            description: "Desc",
          }),
        },
        documentDataFetched: null,
        uploadMode: "create",
        uploadedFile: null,
        content: { html: "<p>Content</p>" },
        documentPdf: null,
        isGeneratingPdf: false,
        pdfGenerationError: null,
        signatureImage: null,
        signatureData: null,
        signaturePosition: { x: 0, y: 0, page: 1 },
        signatureHistory: [],
        isPdfSigned: false,
        finalPdfUrl: "",
        isSaving: false,
        saveStatus: "idle",
        documentCreationError: null,
        documentUpdateError: null,
        documentUpdateSuccess: false,
      };

      const handler = createStepHandler(state, mockDeps);
      await handler.handleNext();

      expect(mockDeps.updateStep).toHaveBeenCalledWith(2);
    });
  });

  describe("handleNext - Step 2", () => {
    it("updates document with create mode", async () => {
      const state: DocumentWorkflowState = {
        currentStep: 2,
        subStep: 1,
        createdDocumentId: "doc-1",
        step1FormState: null,
        uploadMode: "create",
        uploadedFile: null,
        content: { html: "<p>Content</p>" },
        documentPdf: null,
        isGeneratingPdf: false,
        pdfGenerationError: null,
        signatureImage: null,
        signatureData: null,
        signaturePosition: { x: 0, y: 0, page: 1 },
        signatureHistory: [],
        isPdfSigned: false,
        finalPdfUrl: "",
        isSaving: false,
        saveStatus: "idle",
        documentCreationError: null,
        documentCreationSuccess: false,
        documentUpdateError: null,
        documentUpdateSuccess: false,
        documentDataFetched: null,
      };

      const handler = createStepHandler(state, mockDeps);
      await handler.handleNext();

      expect(mockDeps.resetDocumentUpdate).toHaveBeenCalled();
      expect(mockDeps.updateDocument).toHaveBeenCalledWith({
        id: "doc-1",
        sourceType: "blank",
        currentStep: 3,
      });
      expect(mockDeps.updateStep).toHaveBeenCalledWith(3);
    });

    it("sets error for upload mode", async () => {
      const state: DocumentWorkflowState = {
        currentStep: 2,
        subStep: 1,
        createdDocumentId: "doc-1",
        step1FormState: null,
        uploadMode: "upload",
        uploadedFile: null,
        content: { html: "<p>Content</p>" },
        documentPdf: null,
        isGeneratingPdf: false,
        pdfGenerationError: null,
        signatureImage: null,
        signatureData: null,
        signaturePosition: { x: 0, y: 0, page: 1 },
        signatureHistory: [],
        isPdfSigned: false,
        finalPdfUrl: "",
        isSaving: false,
        saveStatus: "idle",
        documentCreationError: null,
        documentCreationSuccess: false,
        documentUpdateError: null,
        documentUpdateSuccess: false,
        documentDataFetched: null,
      };

      const handler = createStepHandler(state, mockDeps);
      await handler.handleNext();

      expect(mockDeps.updateState).toHaveBeenCalledWith({
        documentCreationError: new Error("Upload mode is not yet implemented"),
      });
    });
  });

  describe("handleNext - Step 3", () => {
    it("proceeds to step 4 from sub-step 2", async () => {
      const state: DocumentWorkflowState = {
        currentStep: 3,
        subStep: 2,
        createdDocumentId: "doc-1",
        step1FormState: null,
        uploadMode: "create",
        uploadedFile: null,
        content: { html: "<p>Content</p>" },
        documentPdf: null,
        isGeneratingPdf: false,
        pdfGenerationError: null,
        signatureImage: null,
        signatureData: null,
        signaturePosition: { x: 0, y: 0, page: 1 },
        signatureHistory: [],
        isPdfSigned: false,
        finalPdfUrl: "",
        isSaving: false,
        saveStatus: "idle",
        documentCreationError: null,
        documentCreationSuccess: false,
        documentUpdateError: null,
        documentUpdateSuccess: false,
        documentDataFetched: null,
      };

      const handler = createStepHandler(state, mockDeps);
      await handler.handleNext();

      expect(mockDeps.updateStep).toHaveBeenCalledWith(4);
    });
  });

  describe("handlePrevious", () => {
    it("goes to sub-step 1 from step 3.2", () => {
      const state: DocumentWorkflowState = {
        currentStep: 3,
        subStep: 2,
        createdDocumentId: "doc-1",
        step1FormState: null,
        uploadMode: "create",
        uploadedFile: null,
        content: { html: "<p>Content</p>" },
        documentPdf: null,
        isGeneratingPdf: false,
        pdfGenerationError: null,
        signatureImage: null,
        signatureData: null,
        signaturePosition: { x: 0, y: 0, page: 1 },
        signatureHistory: [],
        isPdfSigned: false,
        finalPdfUrl: "",
        isSaving: false,
        saveStatus: "idle",
        documentCreationError: null,
        documentCreationSuccess: false,
        documentUpdateError: null,
        documentUpdateSuccess: false,
        documentDataFetched: null,
      };

      const handler = createStepHandler(state, mockDeps);
      handler.handlePrevious();

      expect(mockDeps.updateState).toHaveBeenCalledWith({ subStep: 1 });
    });

    it("goes to step 2 from step 3.1", () => {
      const state: DocumentWorkflowState = {
        currentStep: 3,
        subStep: 1,
        createdDocumentId: "doc-1",
        step1FormState: null,
        uploadMode: "create",
        uploadedFile: null,
        content: { html: "<p>Content</p>" },
        documentPdf: null,
        isGeneratingPdf: false,
        pdfGenerationError: null,
        signatureImage: null,
        signatureData: null,
        signaturePosition: { x: 0, y: 0, page: 1 },
        signatureHistory: [],
        isPdfSigned: false,
        finalPdfUrl: "",
        isSaving: false,
        saveStatus: "idle",
        documentCreationError: null,
        documentCreationSuccess: false,
        documentUpdateError: null,
        documentUpdateSuccess: false,
        documentDataFetched: null,
      };

      const handler = createStepHandler(state, mockDeps);
      handler.handlePrevious();

      expect(mockDeps.updateState).toHaveBeenCalledWith({ currentStep: 2 });
    });

    it("goes to step 1 from step 2", () => {
      const state: DocumentWorkflowState = {
        currentStep: 2,
        subStep: 1,
        createdDocumentId: "doc-1",
        step1FormState: null,
        uploadMode: "create",
        uploadedFile: null,
        content: { html: "<p>Content</p>" },
        documentPdf: null,
        isGeneratingPdf: false,
        pdfGenerationError: null,
        signatureImage: null,
        signatureData: null,
        signaturePosition: { x: 0, y: 0, page: 1 },
        signatureHistory: [],
        isPdfSigned: false,
        finalPdfUrl: "",
        isSaving: false,
        saveStatus: "idle",
        documentCreationError: null,
        documentCreationSuccess: false,
        documentUpdateError: null,
        documentUpdateSuccess: false,
        documentDataFetched: null,
      };

      const handler = createStepHandler(state, mockDeps);
      handler.handlePrevious();

      expect(mockDeps.updateState).toHaveBeenCalledWith({ currentStep: 1 });
    });

    it("does nothing from step 1", () => {
      const state: DocumentWorkflowState = {
        currentStep: 1,
        subStep: 1,
        createdDocumentId: "doc-1",
        step1FormState: null,
        uploadMode: "create",
        uploadedFile: null,
        content: { html: "<p>Content</p>" },
        documentPdf: null,
        isGeneratingPdf: false,
        pdfGenerationError: null,
        signatureImage: null,
        signatureData: null,
        signaturePosition: { x: 0, y: 0, page: 1 },
        signatureHistory: [],
        isPdfSigned: false,
        finalPdfUrl: "",
        isSaving: false,
        saveStatus: "idle",
        documentCreationError: null,
        documentCreationSuccess: false,
        documentUpdateError: null,
        documentUpdateSuccess: false,
        documentDataFetched: null,
      };

      const handler = createStepHandler(state, mockDeps);
      handler.handlePrevious();

      expect(mockDeps.updateState).not.toHaveBeenCalled();
    });
  });
});
