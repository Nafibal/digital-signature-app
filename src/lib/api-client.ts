/**
 * API Client
 *
 * Base fetch wrapper for API calls with consistent error handling
 */

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * API Request configuration
 */
export interface ApiRequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: unknown;
  cache?: RequestCache;
}

/**
 * Base API client function
 *
 * @param url - API endpoint URL
 * @param config - Request configuration
 * @returns API response with data or error
 */
export async function apiClient<T>(
  url: string,
  config: ApiRequestConfig = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", headers = {}, body, cache = "no-cache" } = config;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || data.message || "Request failed",
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: 500,
    };
  }
}

/**
 * GET request helper
 */
export async function get<T>(url: string, headers?: Record<string, string>) {
  return apiClient<T>(url, { method: "GET", headers });
}

/**
 * POST request helper
 */
export async function post<T>(
  url: string,
  body: unknown,
  headers?: Record<string, string>
) {
  return apiClient<T>(url, { method: "POST", body, headers });
}

/**
 * PUT request helper
 */
export async function put<T>(
  url: string,
  body: unknown,
  headers?: Record<string, string>
) {
  return apiClient<T>(url, { method: "PUT", body, headers });
}

/**
 * DELETE request helper
 */
export async function del<T>(url: string, headers?: Record<string, string>) {
  return apiClient<T>(url, { method: "DELETE", headers });
}

/**
 * PATCH request helper
 */
export async function patch<T>(
  url: string,
  body: unknown,
  headers?: Record<string, string>
) {
  return apiClient<T>(url, { method: "PATCH", body, headers });
}
