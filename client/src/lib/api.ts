import { ApiResponse } from "@/types";

// NEXT_PUBLIC_API_URL should point to Express backend host, e.g. http://localhost:5000
// /api prefix is appended here for all API routes
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  // Set default headers
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
    // By default send cookies (important for Better Auth session management)
    credentials: options.credentials || "include",
  };

  try {
    const response = await fetch(url, config);
    
    // Handle streaming responses separately if needed, but for standard JSON:
    if (response.headers.get("Content-Type")?.includes("application/json")) {
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: data.error || response.statusText || "Request failed",
          message: data.message,
        };
      }
      return data as ApiResponse<T>;
    }

    if (!response.ok) {
      return {
        success: false,
        error: response.statusText || `Request failed with status ${response.status}`,
      };
    }

    // Non-JSON successful response (e.g., text or empty response)
    const textData = await response.text();
    return {
      success: true,
      data: textData as unknown as T,
    };
  } catch (error: any) {
    console.error(`API Error calling ${endpoint}:`, error);
    return {
      success: false,
      error: error.message || "Network connection error",
    };
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "GET" }),
    
  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    
  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    
  patch: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
