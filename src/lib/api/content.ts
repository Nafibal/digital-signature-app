/**
 * Content API
 * API functions for document content management
 */

/**
 * Save document content
 */
export async function saveDocumentContent(
  documentId: string,
  tiptapJson: Record<string, unknown>,
  htmlContent?: string
): Promise<unknown> {
  const response = await fetch(`/api/documents/${documentId}/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contentJson: tiptapJson,
      htmlContent, // Optional for backward compatibility
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
export async function getDocumentContent(documentId: string): Promise<unknown> {
  const response = await fetch(`/api/documents/${documentId}/content`);

  if (!response.ok) {
    const errorData = (await response.json()) as { message?: string };
    throw new Error(errorData.message || "Failed to get content");
  }

  return response.json();
}

/**
 * Generate PDF preview from Tiptap JSON
 */
export async function generatePDFPreview(
  documentId: string,
  tiptapJson: Record<string, unknown>
): Promise<ArrayBuffer> {
  const response = await fetch(`/api/documents/${documentId}/preview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tiptapJson,
    }),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { message?: string };
    throw new Error(errorData.message || "Failed to generate preview");
  }

  return response.arrayBuffer();
}
