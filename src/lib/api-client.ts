import { API_BASE_URL } from "@/lib/env";
import {
  ApiError,
  AUTH_SESSION_EXPIRED_EVENT,
  NotFoundError,
  UnauthorizedError,
  ValidationApiError,
} from "@/lib/api-errors";
import { getStoredToken } from "@features/auth/lib/token-storage";

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown; auth?: boolean };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;
  const token = auth ? getStoredToken() : null;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 and the API's 401/404 responses all come back with an empty body —
  // calling res.json() on them would throw, so read as text first.
  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    if (res.status === 401) {
      // Only a rejected *authenticated* call means the session actually died.
      // A plain login attempt (auth:false) also 401s on bad credentials and
      // is handled locally by the caller — it must not trigger a redirect.
      if (auth && token) {
        window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
      }
      throw new UnauthorizedError();
    }
    if (res.status === 404) throw new NotFoundError();
    if (res.status === 400 && data?.errors) {
      throw new ValidationApiError(data.title ?? "Validation failed", res.status, data.errors);
    }
    throw new ApiError(data?.title ?? `Request failed (${res.status})`, res.status);
  }

  return data as T;
}

export const apiClient = {
  get: <T,>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "GET" }),
  post: <T,>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T,>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T,>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: "DELETE" }),
};
