/**
 * Document API Client
 *
 * This file contains functions for interacting with the document API endpoints.
 * All functions are typed and include proper error handling.
 */

/**
 * Document status enum
 */
export type DocumentStatus = "draft" | "signed";

/**
 * Create document request payload
 */
export interface CreateDocumentRequest {
  title: string;
  description?: string;
  documentType?: string;
}

/**
 * Create document response
 */
export interface CreateDocumentResponse {
  id: string;
  title: string;
  description: string | null;
  documentType: string | null;
  currentStep: number;
  subStep?: number | null;
  status: DocumentStatus;
}

/**
 * Update document request payload (all fields optional for partial updates)
 */
export interface UpdateDocumentRequest {
  title?: string;
  description?: string;
  documentType?: string;
  sourceType?: string;
  currentStep?: number;
  subStep?: number;
  pdfPath?: string;
  currentPdfId?: string;
}

/**
 * Update document response
 */
export interface UpdateDocumentResponse {
  id: string;
  title: string;
  description: string | null;
  documentType: string | null;
  currentStep: number;
  subStep?: number | null;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Document PDF response
 */
export interface DocumentPdf {
  id: string;
  pdfPath: string;
  fileName: string;
  fileSize: number;
  pageCount?: number;
  status: string;
}

/**
 * Get single document response
 */
export interface GetDocumentResponse {
  id: string;
  title: string;
  description: string | null;
  documentType: string | null;
  currentStep: number;
  subStep?: number | null;
  status: DocumentStatus;
  sourceType?: string | null;
  pdfPath?: string | null;
  currentPdfId?: string | null;
  currentPdf?: DocumentPdf | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Document item in the list
 */
export interface Document {
  id: string;
  title: string;
  description: string | null;
  documentType: string | null;
  currentStep: number;
  subStep?: number | null;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all documents response
 */
export interface GetAllDocumentsResponse {
  documents: Document[];
}

/**
 * API Error response structure
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[] | undefined>;
}

/**
 * Creates a new document by calling the POST /api/documents endpoint
 *
 * @param data - Document creation data
 * @returns Promise resolving to the created document
 * @throws Error if the request fails
 */
export async function createDocument(
  data: CreateDocumentRequest
): Promise<CreateDocumentResponse> {
  try {
    const response = await fetch("/api/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: "Failed to create document",
      }));

      throw new Error(errorData.message || "Failed to create document");
    }

    const result: CreateDocumentResponse = await response.json();
    return result;
  } catch (error) {
    // Re-throw with a more user-friendly message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while creating the document");
  }
}

/**
 * Fetches all documents for the authenticated user by calling the GET /api/documents endpoint
 *
 * @returns Promise resolving to an array of documents
 * @throws Error if the request fails
 */
export async function getAllDocuments(): Promise<Document[]> {
  try {
    const response = await fetch("/api/documents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: "Failed to fetch documents",
      }));

      throw new Error(errorData.message || "Failed to fetch documents");
    }

    const result: GetAllDocumentsResponse = await response.json();
    return result.documents;
  } catch (error) {
    // Re-throw with a more user-friendly message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while fetching documents");
  }
}

/**
 * Fetches a single document by ID by calling the GET /api/documents/[id] endpoint
 *
 * @param id - The document ID to fetch
 * @returns Promise resolving to the document
 * @throws Error if the request fails
 */
export async function getDocument(id: string): Promise<GetDocumentResponse> {
  try {
    const response = await fetch(`/api/documents/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: "Failed to fetch document",
      }));

      throw new Error(errorData.message || "Failed to fetch document");
    }

    const result: GetDocumentResponse = await response.json();
    return result;
  } catch (error) {
    // Re-throw with a more user-friendly message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while fetching the document");
  }
}

/**
 * Updates a document by ID by calling the PATCH /api/documents/[id] endpoint
 *
 * @param id - The document ID to update
 * @param data - Document update data (partial, all fields optional)
 * @returns Promise resolving to the updated document
 * @throws Error if the request fails
 */
export async function updateDocument(
  id: string,
  data: UpdateDocumentRequest
): Promise<UpdateDocumentResponse> {
  try {
    const response = await fetch(`/api/documents/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: "Failed to update document",
      }));

      throw new Error(errorData.message || "Failed to update document");
    }

    const result: UpdateDocumentResponse = await response.json();
    return result;
  } catch (error) {
    // Re-throw with a more user-friendly message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while updating the document");
  }
}
