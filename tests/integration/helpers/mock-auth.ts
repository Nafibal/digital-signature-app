/**
 * Mock Authentication Helpers
 *
 * Utility functions for mocking authentication in tests
 */

import { vi } from "vitest";

/**
 * Mock session type matching better-auth Session structure
 */
export type MockSession = {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: {
    id: string;
    email: string;
    name: string;
  };
};

// Mock the auth module
vi.mock("@/server/auth/config", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// Get the mocked auth module
import { auth } from "@/server/auth/config";

/**
 * Sets up an authenticated test session
 */
export function mockAuthSession(session: MockSession) {
  vi.mocked(auth.api.getSession).mockResolvedValue(
    session as unknown as Awaited<ReturnType<typeof auth.api.getSession>>
  );
}

/**
 * Sets up an unauthenticated test state
 */
export function mockUnauthenticated() {
  vi.mocked(auth.api.getSession).mockResolvedValue(null);
}

/**
 * Clears all auth mocks
 */
export function clearAuthMocks() {
  vi.mocked(auth.api.getSession).mockClear();
}
