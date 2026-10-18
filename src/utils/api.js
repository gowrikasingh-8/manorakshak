const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const defaultBaseUrl = import.meta.env.DEV ? "http://localhost:8000" : "/api";

export const API_BASE_URL = (configuredBaseUrl || defaultBaseUrl).replace(/\/+$/, "");
const TOKEN_KEY = "manorakshak_access_token";

export class ApiError extends Error {
  constructor(message, statusCode = 0) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export function setAuthToken(token) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Authentication remains usable for the current view if browser storage is unavailable.
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  } catch {
    // Requests can still be made to public endpoints when storage is unavailable.
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
      ...options,
      headers,
      signal: options.signal || AbortSignal.timeout(12000),
    });
  } catch (error) {
    throw new ApiError(
      error.name === "TimeoutError"
        ? "The server is taking too long to respond."
        : "The backend could not be reached.",
    );
  }

  let result;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const detail =
      typeof result?.detail === "string"
        ? result.detail
        : `The server returned an error (${response.status}).`;
    throw new ApiError(
      detail,
      response.status,
    );
  }
  return result;
}
