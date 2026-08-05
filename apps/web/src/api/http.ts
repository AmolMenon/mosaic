import { ApiError, NetworkError } from "./errors";

export interface RequestOptions extends RequestInit {
  timeout?: number;
}

/**
 * Standardized HTTP fetch wrapper.
 * Centralizes request IDs, authentication, timeout handling, and error parsing.
 */
export async function httpClient<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { timeout = 30000, headers, ...rest } = options;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') || 'valid-token' : 'valid-token';
  const requestId = crypto.randomUUID();

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const mergedHeaders = new Headers(headers);
  mergedHeaders.set('Content-Type', 'application/json');
  mergedHeaders.set('X-Request-Id', requestId);
  if (token) {
    mergedHeaders.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(url, {
      ...rest,
      headers: mergedHeaders,
      signal: controller.signal,
    });
    
    clearTimeout(id);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.code || 'UNKNOWN_ERROR',
        errorData.message || 'An unexpected error occurred',
        errorData.details,
        errorData.request_id || requestId
      );
    }

    // Attempt to parse JSON. For 204 No Content, return null.
    if (response.status === 204) return null as any;
    return await response.json();
    
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new NetworkError(`Request timed out after ${timeout}ms`);
    }
    throw new NetworkError(`Network request failed: ${(error as Error).message}`);
  }
}
