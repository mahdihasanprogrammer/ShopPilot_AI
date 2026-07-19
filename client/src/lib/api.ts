import { ApiResponse } from "@/types";

// Express backend host — /api prefix is appended automatically
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

// ---- Session Token Store ----
// The AuthProvider calls setApiSessionToken whenever the session changes.
// This token is sent as Authorization: Bearer <token> on every Express API call
// so the backend can validate the session without cookie cross-origin issues.
let _sessionToken: string | null = null;

export function setApiSessionToken(token: string | null) {
  _sessionToken = token;
}

// ---- Core Request Function ----
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Attach session token as Bearer for Express backend auth
  if (!headers.has("Authorization")) {
    let token = _sessionToken;
    if (!token && typeof window !== "undefined") {
      try {
        const { authClient } = await import("./auth-client");
        const session = await authClient.getSession();
        token = session?.data?.session?.token || null;
      } catch (err) {
        console.error("Failed to retrieve auth token for request:", err);
      }
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: options.credentials || "include",
  };

  try {
    const response = await fetch(url, config);

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

    const textData = await response.text();
    return { success: true, data: textData as unknown as T };
  } catch (error: any) {
    console.error(`API Error calling ${endpoint}:`, error);
    return {
      success: false,
      error: error.message || "Network connection error",
    };
  }
}

// ---- HTTP Methods ----
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
