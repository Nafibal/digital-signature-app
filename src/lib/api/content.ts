/**
 * Content API
 * API functions for document content management
 */

/**
 * Document content response
 */
export interface DocumentContent {
  id: string;
  documentId: string;
  htmlContent: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get document content response
 */
export interface GetDocumentContentResponse {
  content: DocumentContent | null;
}

/**
 * Save document content
 */
export async function saveDocumentContent(
  documentId: string,
  htmlContent: string
): Promise<unknown> {
  const response = await fetch(`/api/documents/${documentId}/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      htmlContent,
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message?: string };
    throw new Error(errorData.message || "Failed to save content");
  }

  return response.json();
}

/**
 * Get document content
 */
export async function getDocumentContent(
  documentId: string
): Promise<GetDocumentContentResponse> {
  const response = await fetch(`/api/documents/${documentId}/content`);

  if (!response.ok) {
    const errorData = (await response.json()) as { message?: string };
    throw new Error(errorData.message || "Failed to get content");
  }

  return response.json();
}
