// lib/apiClient.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Attach token if available
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  // For FormData, let the browser set the Content-Type
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          localStorage.removeItem("token");
        }
      }
      throw new Error(
        data.message ||
          data.error ||
          `Request failed with status ${response.status}`,
      );
    }

    return data as T;
  } catch (error) {
    console.error("API Client Error:", error);
    throw error;
  }
}
