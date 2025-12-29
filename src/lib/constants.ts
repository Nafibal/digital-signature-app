/**
 * Application Constants
 *
 * Centralized constants for the application
 */

// ============================================================================
// App Configuration
// ============================================================================

export const APP_NAME = "DigiSign";
export const APP_VERSION = "1.0.0";

// ============================================================================
// File Upload Limits
// ============================================================================

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILE_SIZE_MB = 10;
export const ALLOWED_FILE_TYPES = ["application/pdf"];

// ============================================================================
// PDF Configuration
// ============================================================================

export const PDF_SCALE = 1.5;
export const SIGNATURE_IMAGE_WIDTH = 400;
export const SIGNATURE_IMAGE_HEIGHT = 150;

// ============================================================================
// Storage Paths
// ============================================================================

export const STORAGE_BUCKET_DOCUMENTS = "documents";
export const STORAGE_PATH_DOCUMENTS = "documents";

// ============================================================================
// Workflow Configuration
// ============================================================================

export const WORKFLOW_STEPS = {
  CHECK: 1,
  UPLOAD: 2,
  FILL_CONTENT: 3,
  ADD_SIGNATURE: 3,
  FINAL_REVIEW: 4,
} as const;

export const WORKFLOW_SUB_STEPS = {
  FILL_CONTENT: 1,
  ADD_SIGNATURE: 2,
} as const;

// ============================================================================
// Status Messages
// ============================================================================

export const STATUS_MESSAGES = {
  CREATING: "Creating document...",
  UPDATING: "Updating document...",
  SAVING: "Saving draft...",
  GENERATING_PDF: "Generating PDF...",
  SIGNING_PDF: "Signing PDF...",
  LOADING: "Loading...",
  SAVED: "Saved successfully",
  ERROR: "An error occurred",
} as const;

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`,
  INVALID_FILE_TYPE: "Only PDF files are allowed",
  NETWORK_ERROR: "Network error. Please check your connection",
  TIMEOUT_ERROR: "Request timed out. Please try again",
  DOCUMENT_NOT_FOUND: "Document not found",
  FAILED_TO_CREATE: "Failed to create document",
  FAILED_TO_UPDATE: "Failed to update document",
  FAILED_TO_UPLOAD: "Failed to upload file",
  FAILED_TO_GENERATE_PDF: "Failed to generate PDF",
  FAILED_TO_SIGN_PDF: "Failed to sign PDF",
} as const;

// ============================================================================
// Timeouts
// ============================================================================

export const API_TIMEOUT = 30000; // 30 seconds
export const AUTO_SAVE_DELAY = 2000; // 2 seconds
export const SUCCESS_MESSAGE_DELAY = 2000; // 2 seconds

// ============================================================================
// Pagination
// ============================================================================

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
