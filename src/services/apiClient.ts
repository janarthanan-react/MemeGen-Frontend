import type { ApiErrorResponse } from '../types/api';

/**
 * Standard API error class to wrap backend error responses.
 */
export class ApiError extends Error {
  public code: string;
  public status: number;
  public details?: Record<string, string[]>;

  constructor(message: string, status: number, code = 'API_ERROR', details?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Safe retrieval of configured backend API base URL from Vite environment.
 */
function resolveBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  if (!envUrl) {
    throw new Error("VITE_API_BASE_URL is not configured");
  }

  const clean = envUrl.trim().replace(/\/+$/, "");

  if (clean.endsWith("/api/v1")) return clean;
  if (clean.endsWith("/api")) return `${clean}/v1`;

  return `${clean}/api/v1`;
}

export const API_BASE_URL = resolveBaseUrl();

/**
 * Lightweight, type-safe API client for MemeHub backend integration.
 * Uses native fetch without bloated dependencies.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
      : null;
  if (token) {
    (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorBody: ApiErrorResponse | null = null;
      try {
        errorBody = await response.json();
      } catch {
        // Response wasn't JSON
      }

      throw new ApiError(
        errorBody?.error?.message || `Request failed with HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorBody?.error?.code || `HTTP_${response.status}`,
        errorBody?.error?.details
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown network error occurred',
      0,
      'NETWORK_FAILURE'
    );
  }
}
