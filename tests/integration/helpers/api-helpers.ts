/**
 * API Test Helpers
 *
 * Utility functions for testing API endpoints
 */

/**
 * Creates a mock Next.js Request object
 * Note: Using a simpler approach to avoid TypeScript compatibility issues
 */
export function createTestRequest(
  method: string,
  body?: unknown,
  headers?: Record<string, string>
): Request {
  const url = "http://localhost:3000/api/documents";

  const requestInit: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    requestInit.body = JSON.stringify(body);
  }

  return new Request(url, requestInit);
}

/**
 * Creates a mock Next.js GET request
 */
export function createGetRequest(): Request {
  return createTestRequest("GET");
}

/**
 * Creates a mock Next.js POST request with body
 */
export function createPostRequest(body: unknown): Request {
  return createTestRequest("POST", body);
}

/**
 * Creates a mock Next.js PATCH request with body
 */
export function createPatchRequest(body: unknown): Request {
  return createTestRequest("PATCH", body);
}

/**
 * Validates a successful API response
 */
export function expectSuccessResponse(
  response: Response,
  expectedStatus: number = 200
) {
  expect(response.status).toBe(expectedStatus);
  expect(response.ok).toBe(true);
}

/**
 * Validates an error API response
 */
export function expectErrorResponse(
  response: Response,
  expectedStatus: number
) {
  expect(response.status).toBe(expectedStatus);
  expect(response.ok).toBe(false);
}

/**
 * Parses JSON response body
 */
export async function parseResponse<T>(response: Response): Promise<T> {
  return response.json() as Promise<T>;
}

/**
 * Creates a mock Headers object
 */
export function createTestHeaders(headers?: Record<string, string>): Headers {
  const mockHeaders = new Headers();
  mockHeaders.set("Content-Type", "application/json");

  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      mockHeaders.set(key, value);
    });
  }

  return mockHeaders;
}
