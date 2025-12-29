/**
 * Error Handler Utility
 *
 * Centralized error handling with consistent error codes and context.
 * Provides user-friendly error messages and error classification.
 */

/**
 * Workflow Error Class
 * Extends Error with additional context for better error tracking
 */
export class WorkflowError extends Error {
  constructor(message: string, public code: string, public context?: string) {
    super(message);
    this.name = "WorkflowError";
  }
}

/**
 * Error Codes
 * Standardized error codes for workflow operations
 */
export enum WorkflowErrorCode {
  // Document errors
  DOCUMENT_NOT_FOUND = "DOCUMENT_NOT_FOUND",
  DOCUMENT_CREATE_FAILED = "DOCUMENT_CREATE_FAILED",
  DOCUMENT_UPDATE_FAILED = "DOCUMENT_UPDATE_FAILED",

  // Content errors
  CONTENT_SAVE_FAILED = "CONTENT_SAVE_FAILED",
  CONTENT_LOAD_FAILED = "CONTENT_LOAD_FAILED",

  // PDF errors
  PDF_GENERATION_FAILED = "PDF_GENERATION_FAILED",
  PDF_LOAD_FAILED = "PDF_LOAD_FAILED",

  // Signature errors
  SIGNATURE_CREATE_FAILED = "SIGNATURE_CREATE_FAILED",
  SIGNATURE_INVALID = "SIGNATURE_INVALID",

  // Network errors
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",

  // Validation errors
  VALIDATION_ERROR = "VALIDATION_ERROR",

  // Unknown errors
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Handle Workflow Error
 * Converts unknown errors to WorkflowError with proper classification
 *
 * @param error - The error to handle
 * @param context - Context where the error occurred (e.g., "createDocument", "generatePdf")
 * @returns A WorkflowError with proper classification
 *
 * @example
 * ```typescript
 * try {
 *   await createDocument(data);
 * } catch (error) {
 *   const workflowError = handleWorkflowError(error, "createDocument");
 *   // workflowError.code and workflowError.context are now available
 * }
 * ```
 */
export function handleWorkflowError(
  error: unknown,
  context: string
): WorkflowError {
  // Already a WorkflowError
  if (error instanceof WorkflowError) {
    return error;
  }

  // Standard Error
  if (error instanceof Error) {
    // Classify error based on message content
    const code = classifyError(error.message);
    return new WorkflowError(error.message, code, context);
  }

  // Unknown error type
  return new WorkflowError(
    "An unknown error occurred",
    WorkflowErrorCode.UNKNOWN_ERROR,
    context
  );
}

/**
 * Classify Error
 * Determines error code based on error message content
 */
function classifyError(message: string): WorkflowErrorCode {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("network") || lowerMessage.includes("fetch")) {
    return WorkflowErrorCode.NETWORK_ERROR;
  }

  if (lowerMessage.includes("timeout")) {
    return WorkflowErrorCode.TIMEOUT_ERROR;
  }

  if (lowerMessage.includes("document") && lowerMessage.includes("not found")) {
    return WorkflowErrorCode.DOCUMENT_NOT_FOUND;
  }

  if (lowerMessage.includes("create") && lowerMessage.includes("document")) {
    return WorkflowErrorCode.DOCUMENT_CREATE_FAILED;
  }

  if (lowerMessage.includes("update") && lowerMessage.includes("document")) {
    return WorkflowErrorCode.DOCUMENT_UPDATE_FAILED;
  }

  if (lowerMessage.includes("pdf") && lowerMessage.includes("generate")) {
    return WorkflowErrorCode.PDF_GENERATION_FAILED;
  }

  if (lowerMessage.includes("pdf") && lowerMessage.includes("load")) {
    return WorkflowErrorCode.PDF_LOAD_FAILED;
  }

  if (lowerMessage.includes("content") && lowerMessage.includes("save")) {
    return WorkflowErrorCode.CONTENT_SAVE_FAILED;
  }

  if (lowerMessage.includes("content") && lowerMessage.includes("load")) {
    return WorkflowErrorCode.CONTENT_LOAD_FAILED;
  }

  if (lowerMessage.includes("signature")) {
    return WorkflowErrorCode.SIGNATURE_CREATE_FAILED;
  }

  if (lowerMessage.includes("validation") || lowerMessage.includes("invalid")) {
    return WorkflowErrorCode.VALIDATION_ERROR;
  }

  return WorkflowErrorCode.UNKNOWN_ERROR;
}

/**
 * Get User-Friendly Error Message
 * Converts error codes to user-friendly messages
 */
export function getUserErrorMessage(error: WorkflowError): string {
  const messages: Record<WorkflowErrorCode, string> = {
    [WorkflowErrorCode.DOCUMENT_NOT_FOUND]: "Document not found",
    [WorkflowErrorCode.DOCUMENT_CREATE_FAILED]: "Failed to create document",
    [WorkflowErrorCode.DOCUMENT_UPDATE_FAILED]: "Failed to update document",
    [WorkflowErrorCode.CONTENT_SAVE_FAILED]: "Failed to save content",
    [WorkflowErrorCode.CONTENT_LOAD_FAILED]: "Failed to load content",
    [WorkflowErrorCode.PDF_GENERATION_FAILED]: "Failed to generate PDF",
    [WorkflowErrorCode.PDF_LOAD_FAILED]: "Failed to load PDF",
    [WorkflowErrorCode.SIGNATURE_CREATE_FAILED]: "Failed to create signature",
    [WorkflowErrorCode.SIGNATURE_INVALID]: "Invalid signature data",
    [WorkflowErrorCode.NETWORK_ERROR]:
      "Network error. Please check your connection",
    [WorkflowErrorCode.TIMEOUT_ERROR]: "Request timed out. Please try again",
    [WorkflowErrorCode.VALIDATION_ERROR]: "Invalid data provided",
    [WorkflowErrorCode.UNKNOWN_ERROR]: "An unexpected error occurred",
  };

  // Check if error.code is a valid WorkflowErrorCode
  if (
    Object.values(WorkflowErrorCode).includes(error.code as WorkflowErrorCode)
  ) {
    return messages[error.code as WorkflowErrorCode];
  }

  return messages[WorkflowErrorCode.UNKNOWN_ERROR];
}
