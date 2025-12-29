/**
 * Document Test Fixtures
 *
 * Mock data for document integration tests
 */

import type { Document } from "@/features/document/services";

/**
 * Mock user for testing
 */
export const mockUser = {
  id: "user-123",
  email: "test@example.com",
  name: "Test User",
};

/**
 * Mock documents for testing
 */
export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    title: "Test Document 1",
    description: "Description for document 1",
    documentType: "contract",
    currentStep: 1,
    subStep: 1,
    status: "draft",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "doc-2",
    title: "Test Document 2",
    description: "Description for document 2",
    documentType: "agreement",
    currentStep: 2,
    subStep: 1,
    status: "draft",
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "doc-3",
    title: "Test Document 3",
    description: null,
    documentType: "invoice",
    currentStep: 4,
    status: "signed",
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-03T00:00:00.000Z",
  },
];

/**
 * Mock document creation request
 */
export const mockCreateDocumentRequest = {
  title: "New Test Document",
  description: "Description for new document",
  documentType: "contract",
};

/**
 * Mock document update request
 */
export const mockUpdateDocumentRequest = {
  title: "Updated Document Title",
  description: "Updated description",
  documentType: "agreement",
  currentStep: 2,
  subStep: 1,
};

/**
 * Mock partial update request
 */
export const mockPartialUpdateRequest = {
  title: "Just updating title",
};

/**
 * Mock session for authenticated user
 */
export const mockSession = {
  user: {
    id: mockUser.id,
    email: mockUser.email,
    name: mockUser.name,
  },
  session: {
    id: "session-123",
    userId: mockUser.id,
    expiresAt: new Date(Date.now() + 3600000),
    token: "mock-token-123",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
