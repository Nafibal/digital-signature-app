/**
 * Mock Database Helpers
 *
 * Utility functions for mocking database operations in tests
 */

import { vi } from "vitest";

// Mock the services module
vi.mock("@/server/services", () => ({
  getAllDocumentsForUser: vi.fn(),
  createNewDocument: vi.fn(),
  updateDocumentForUser: vi.fn(),
}));

// Get the mocked services
import {
  getAllDocumentsForUser,
  createNewDocument,
  updateDocumentForUser,
} from "@/server/services";

/**
 * Mocks getAllDocumentsForUser service function
 */
export function mockGetAllDocuments(documents: unknown[]) {
  vi.mocked(getAllDocumentsForUser).mockResolvedValue(
    documents as Awaited<ReturnType<typeof getAllDocumentsForUser>>
  );
}

/**
 * Mocks createNewDocument service function
 */
export function mockCreateDocument(document: unknown) {
  vi.mocked(createNewDocument).mockResolvedValue(
    document as Awaited<ReturnType<typeof createNewDocument>>
  );
}

/**
 * Mocks updateDocumentForUser service function
 */
export function mockUpdateDocument(document: unknown) {
  vi.mocked(updateDocumentForUser).mockResolvedValue(
    document as Awaited<ReturnType<typeof updateDocumentForUser>>
  );
}

/**
 * Mocks createNewDocument to throw an error
 */
export function mockCreateDocumentError(error: Error) {
  vi.mocked(createNewDocument).mockRejectedValue(error);
}

/**
 * Mocks updateDocumentForUser to throw an error
 */
export function mockUpdateDocumentError(error: Error) {
  vi.mocked(updateDocumentForUser).mockRejectedValue(error);
}

/**
 * Mocks getAllDocumentsForUser to throw an error
 */
export function mockGetAllDocumentsError(error: Error) {
  vi.mocked(getAllDocumentsForUser).mockRejectedValue(error);
}

/**
 * Clears all database mocks
 */
export function clearDbMocks() {
  vi.mocked(getAllDocumentsForUser).mockClear();
  vi.mocked(createNewDocument).mockClear();
  vi.mocked(updateDocumentForUser).mockClear();
}
