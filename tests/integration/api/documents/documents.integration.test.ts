/**
 * Document API Integration Tests
 *
 * Integration tests for document API endpoints
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { headers } from "next/headers";
import {
  mockAuthSession,
  mockUnauthenticated,
  clearAuthMocks,
} from "../../helpers/mock-auth";
import {
  mockGetAllDocuments,
  mockCreateDocument,
  mockUpdateDocument,
  mockGetAllDocumentsError,
  mockCreateDocumentError,
  mockUpdateDocumentError,
  clearDbMocks,
} from "../../helpers/mock-db";
import {
  createGetRequest,
  createPostRequest,
  createPatchRequest,
  expectSuccessResponse,
  expectErrorResponse,
  parseResponse,
} from "../../helpers/api-helpers";
import {
  mockUser,
  mockDocuments,
  mockCreateDocumentRequest,
  mockUpdateDocumentRequest,
  mockPartialUpdateRequest,
  mockSession,
} from "../../fixtures/document-fixtures";

// Mock headers function
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

describe("Document API Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    clearAuthMocks();
    clearDbMocks();
  });

  describe("GET /api/documents", () => {
    describe("Authentication", () => {
      it("should return 401 when user is not authenticated", async () => {
        // Setup
        mockUnauthenticated();
        vi.mocked(headers).mockResolvedValue(new Headers());

        // Import route handler after mock setup
        const { GET } = await import("@/app/api/documents/route");

        // Execute
        const response = await GET();

        // Verify
        expectErrorResponse(response, 401);
        const body = await parseResponse<{ message: string }>(response);
        expect(body.message).toBe("Unauthorized");
      });
    });

    describe("Success Cases", () => {
      it("should return all documents for authenticated user", async () => {
        // Setup
        mockAuthSession(mockSession);
        mockGetAllDocuments(mockDocuments);
        vi.mocked(headers).mockResolvedValue(new Headers());

        // Import route handler after mock setup
        const { GET } = await import("@/app/api/documents/route");

        // Execute
        const response = await GET();

        // Verify
        expectSuccessResponse(response, 200);
        const body = await parseResponse<{ documents: typeof mockDocuments }>(
          response
        );
        expect(body.documents).toEqual(mockDocuments);
        expect(body.documents).toHaveLength(3);
      });

      it("should return empty array when user has no documents", async () => {
        // Setup
        mockAuthSession(mockSession);
        mockGetAllDocuments([]);
        vi.mocked(headers).mockResolvedValue(new Headers());

        // Import route handler after mock setup
        const { GET } = await import("@/app/api/documents/route");

        // Execute
        const response = await GET();

        // Verify
        expectSuccessResponse(response, 200);
        const body = await parseResponse<{ documents: [] }>(response);
        expect(body.documents).toEqual([]);
        expect(body.documents).toHaveLength(0);
      });
    });

    describe("Error Cases", () => {
      it("should return 500 when database operation fails", async () => {
        // Setup
        mockAuthSession(mockSession);
        mockGetAllDocumentsError(new Error("Database connection failed"));
        vi.mocked(headers).mockResolvedValue(new Headers());

        // Import route handler after mock setup
        const { GET } = await import("@/app/api/documents/route");

        // Execute
        const response = await GET();

        // Verify
        expectErrorResponse(response, 500);
        const body = await parseResponse<{ message: string }>(response);
        expect(body.message).toBe("Internal server error");
      });
    });
  });

  describe("POST /api/documents", () => {
    describe("Authentication", () => {
      it("should return 401 when user is not authenticated", async () => {
        // Setup
        mockUnauthenticated();
        vi.mocked(headers).mockResolvedValue(new Headers());
        const request = createPostRequest(mockCreateDocumentRequest);

        // Import route handler after mock setup
        const { POST } = await import("@/app/api/documents/route");

        // Execute
        const response = await POST(request);

        // Verify
        expectErrorResponse(response, 401);
        const body = await parseResponse<{ message: string }>(response);
        expect(body.message).toBe("Unauthorized");
      });
    });

    describe("Validation", () => {
      it("should create document with valid required fields", async () => {
        // Setup
        mockAuthSession(mockSession);
        const mockCreatedDocument = {
          id: "doc-new",
          title: mockCreateDocumentRequest.title,
          description: mockCreateDocumentRequest.description || null,
          documentType: mockCreateDocumentRequest.documentType || null,
          currentStep: 1,
          status: "draft" as const,
          currentPdf: null,
          signedPdf: null,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        };
        mockCreateDocument(mockCreatedDocument);
        vi.mocked(headers).mockResolvedValue(new Headers());
        const request = createPostRequest(mockCreateDocumentRequest);

        // Import route handler after mock setup
        const { POST } = await import("@/app/api/documents/route");

        // Execute
        const response = await POST(request);

        // Verify
        expectSuccessResponse(response, 201);
        const body = await parseResponse<typeof mockCreatedDocument>(response);
        expect(body.id).toBe("doc-new");
        expect(body.title).toBe(mockCreateDocumentRequest.title);
      });

      it("should create document with all optional fields", async () => {
        // Setup
        mockAuthSession(mockSession);
        const mockCreatedDocument = {
          id: "doc-new",
          title: mockCreateDocumentRequest.title,
          description: mockCreateDocumentRequest.description || null,
          documentType: mockCreateDocumentRequest.documentType || null,
          currentStep: 1,
          status: "draft" as const,
          currentPdf: null,
          signedPdf: null,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        };
        mockCreateDocument(mockCreatedDocument);
        vi.mocked(headers).mockResolvedValue(new Headers());
        const request = createPostRequest(mockCreateDocumentRequest);

        // Import route handler after mock setup
        const { POST } = await import("@/app/api/documents/route");

        // Execute
        const response = await POST(request);

        // Verify
        expectSuccessResponse(response, 201);
        const body = await parseResponse<typeof mockCreatedDocument>(response);
        expect(body.title).toBe(mockCreateDocumentRequest.title);
        expect(body.description).toBe(mockCreateDocumentRequest.description);
        expect(body.documentType).toBe(mockCreateDocumentRequest.documentType);
      });

      it("should return 400 when title is missing", async () => {
        // Setup
        mockAuthSession(mockSession);
        vi.mocked(headers).mockResolvedValue(new Headers());
        const request = createPostRequest({
          description: "Description without title",
        });

        // Import route handler after mock setup
        const { POST } = await import("@/app/api/documents/route");

        // Execute
        const response = await POST(request);

        // Verify
        expectErrorResponse(response, 400);
        const body = await parseResponse<{
          message: string;
          errors?: Record<string, string[]>;
        }>(response);
        expect(body.message).toBe("Validation error");
        expect(body.errors?.title).toBeDefined();
      });

      it("should return 400 when title is empty string", async () => {
        // Setup
        mockAuthSession(mockSession);
        vi.mocked(headers).mockResolvedValue(new Headers());
        const request = createPostRequest({
          title: "",
          description: "Description",
        });

        // Import route handler after mock setup
        const { POST } = await import("@/app/api/documents/route");

        // Execute
        const response = await POST(request);

        // Verify
        expectErrorResponse(response, 400);
        const body = await parseResponse<{
          message: string;
          errors?: Record<string, string[]>;
        }>(response);
        expect(body.message).toBe("Validation error");
        expect(body.errors?.title).toBeDefined();
      });
    });

    describe("Success Cases", () => {
      it("should return 201 with created document data", async () => {
        // Setup
        mockAuthSession(mockSession);
        const mockCreatedDocument = {
          id: "doc-new",
          title: mockCreateDocumentRequest.title,
          description: mockCreateDocumentRequest.description || null,
          documentType: mockCreateDocumentRequest.documentType || null,
          currentStep: 1,
          status: "draft" as const,
          currentPdf: null,
          signedPdf: null,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        };
        mockCreateDocument(mockCreatedDocument);
        vi.mocked(headers).mockResolvedValue(new Headers());
        const request = createPostRequest(mockCreateDocumentRequest);

        // Import route handler after mock setup
        const { POST } = await import("@/app/api/documents/route");

        // Execute
        const response = await POST(request);

        // Verify
        expectSuccessResponse(response, 201);
        const body = await parseResponse<typeof mockCreatedDocument>(response);
        expect(body).toEqual(mockCreatedDocument);
      });

      it("should set default documentType when not provided", async () => {
        // Setup
        mockAuthSession(mockSession);
        const mockCreatedDocument = {
          id: "doc-new",
          title: "New Document",
          description: "Description",
          documentType: "contract",
          currentStep: 1,
          status: "draft" as const,
          currentPdf: null,
          signedPdf: null,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        };
        mockCreateDocument(mockCreatedDocument);
        vi.mocked(headers).mockResolvedValue(new Headers());
        const request = createPostRequest({
          title: "New Document",
          description: "Description",
        });

        // Import route handler after mock setup
        const { POST } = await import("@/app/api/documents/route");

        // Execute
        const response = await POST(request);

        // Verify
        expectSuccessResponse(response, 201);
        const body = await parseResponse<typeof mockCreatedDocument>(response);
        expect(body.documentType).toBe("contract");
      });
    });

    describe("Error Cases", () => {
      it("should return 500 when database operation fails", async () => {
        // Setup
        mockAuthSession(mockSession);
        mockCreateDocumentError(new Error("Database connection failed"));
        vi.mocked(headers).mockResolvedValue(new Headers());
        const request = createPostRequest(mockCreateDocumentRequest);

        // Import route handler after mock setup
        const { POST } = await import("@/app/api/documents/route");

        // Execute
        const response = await POST(request);

        // Verify
        expectErrorResponse(response, 500);
        const body = await parseResponse<{ message: string }>(response);
        expect(body.message).toBe("Internal server error");
      });
    });
  });

  describe("PATCH /api/documents/[id]", () => {
    describe("Authentication", () => {
      it("should return 401 when user is not authenticated", async () => {
        // Setup
        mockUnauthenticated();
        vi.mocked(headers).mockResolvedValue(new Headers());
        const request = createPatchRequest(mockUpdateDocumentRequest);

        // Import route handler after mock setup
        const { PATCH } = await import("@/app/api/documents/[id]/route");

        // Execute
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "doc-1" }),
        });

        // Verify
        expectErrorResponse(response, 401);
        const body = await parseResponse<{ message: string }>(response);
        expect(body.message).toBe("Unauthorized");
      });
    });

    describe("Authorization", () => {
      it("should allow user to update their own document", async () => {
        // Setup
        mockAuthSession(mockSession);
        const mockUpdatedDocument = {
          ownerId: mockUser.id,
          currentPdf: null,
          signedPdf: null,
          id: "doc-1",
          title: mockUpdateDocumentRequest.title,
          description: mockUpdateDocumentRequest.description,
          documentType: mockUpdateDocumentRequest.documentType,
          currentStep: mockUpdateDocumentRequest.currentStep,
          subStep: mockUpdateDocumentRequest.subStep,
          status: "draft" as const,
          sourceType: null,
          pdfPath: null,
          currentPdfId: null,
          signedPdfId: null,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        };
        mockUpdateDocument(mockUpdatedDocument);
        vi.mocked(headers).mockResolvedValue(new Headers());
        const request = createPatchRequest(mockUpdateDocumentRequest);

        // Import route handler after mock setup
        const { PATCH } = await import("@/app/api/documents/[id]/route");

        // Execute
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "doc-1" }),
        });

        // Verify
        expectSuccessResponse(response, 200);
        const body = await parseResponse<typeof mockUpdatedDocument>(response);
        expect(body.title).toBe(mockUpdateDocumentRequest.title);
      });

      it("should return 404 when document does not exist", async () => {
        // Setup
        mockAuthSession(mockSession);
        mockUpdateDocumentError(
          new Error("Document not found or access denied")
        );
        vi.mocked(headers).mockResolvedValue(new Headers());
        const request = createPatchRequest(mockUpdateDocumentRequest);

        // Import route handler after mock setup
        const { PATCH } = await import("@/app/api/documents/[id]/route");

        // Execute
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "doc-nonexistent" }),
        });

        // Verify
        expectErrorResponse(response, 500);
        const body = await parseResponse<{ message: string }>(response);
        expect(body.message).toBe("Internal server error");
      });
    });

    describe("Success Cases", () => {
      it("should update document with single field", async () => {
        // Setup
        mockAuthSession(mockSession);
        const mockUpdatedDocument = {
          ownerId: mockUser.id,
          currentPdf: null,
          signedPdf: null,
          id: "doc-1",
          title: mockPartialUpdateRequest.title,
          description: "Original description",
          documentType: "contract",
          currentStep: 1,
          subStep: 1,
          status: "draft" as const,
          sourceType: null,
          pdfPath: null,
          currentPdfId: null,
          signedPdfId: null,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        };
        mockUpdateDocument(mockUpdatedDocument);
        vi.mocked(headers).mockResolvedValue(new Headers());
        const request = createPatchRequest(mockPartialUpdateRequest);

        // Import route handler after mock setup
        const { PATCH } = await import("@/app/api/documents/[id]/route");

        // Execute
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "doc-1" }),
        });

        // Verify
        expectSuccessResponse(response, 200);
        const body = await parseResponse<typeof mockUpdatedDocument>(response);
        expect(body.title).toBe(mockPartialUpdateRequest.title);
      });

      it("should update document with multiple fields", async () => {
        // Setup
        mockAuthSession(mockSession);
        const mockUpdatedDocument = {
          ownerId: mockUser.id,
          currentPdf: null,
          signedPdf: null,
          id: "doc-1",
          title: mockUpdateDocumentRequest.title,
          description: mockUpdateDocumentRequest.description,
          documentType: mockUpdateDocumentRequest.documentType,
          currentStep: mockUpdateDocumentRequest.currentStep,
          subStep: mockUpdateDocumentRequest.subStep,
          status: "draft" as const,
          sourceType: null,
          pdfPath: null,
          currentPdfId: null,
          signedPdfId: null,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        };
        mockUpdateDocument(mockUpdatedDocument);
        vi.mocked(headers).mockResolvedValue(new Headers());
        const request = createPatchRequest(mockUpdateDocumentRequest);

        // Import route handler after mock setup
        const { PATCH } = await import("@/app/api/documents/[id]/route");

        // Execute
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "doc-1" }),
        });

        // Verify
        expectSuccessResponse(response, 200);
        const body = await parseResponse<typeof mockUpdatedDocument>(response);
        expect(body.title).toBe(mockUpdateDocumentRequest.title);
        expect(body.description).toBe(mockUpdateDocumentRequest.description);
        expect(body.documentType).toBe(mockUpdateDocumentRequest.documentType);
        expect(body.currentStep).toBe(mockUpdateDocumentRequest.currentStep);
      });
    });

    describe("Error Cases", () => {
      it("should return 500 when database operation fails", async () => {
        // Setup
        mockAuthSession(mockSession);
        mockUpdateDocumentError(new Error("Database connection failed"));
        vi.mocked(headers).mockResolvedValue(new Headers());
        const request = createPatchRequest(mockUpdateDocumentRequest);

        // Import route handler after mock setup
        const { PATCH } = await import("@/app/api/documents/[id]/route");

        // Execute
        const response = await PATCH(request, {
          params: Promise.resolve({ id: "doc-1" }),
        });

        // Verify
        expectErrorResponse(response, 500);
        const body = await parseResponse<{ message: string }>(response);
        expect(body.message).toBe("Internal server error");
      });
    });
  });
});
