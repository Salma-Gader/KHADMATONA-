const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost";

// No `fetch()` call may run longer than this. Without a bound, a slow or
// unresponsive API leaves callers (e.g. AuthProvider's initial /auth/me
// check) awaiting a promise that never settles, which surfaces as a loading
// state that never resolves - see the dashboard "stuck on loading" incident.
// 30s (not 15s) because the local Sail backend's first request after any
// container restart pays a one-time opcache cold-compile cost of ~15-20s on
// this machine's slow Docker-on-Windows bind mount - a hard 15s cutoff was
// aborting exactly that legitimate (if slow) first response.
const REQUEST_TIMEOUT_MS = 30_000;

interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

interface ApiFailure {
  success: false;
  message: string;
  errors: Record<string, string[]>;
  code: string | null;
}

export class ApiError extends Error {
  readonly status: number;
  readonly errors: Record<string, string[]>;
  readonly code: string | null;

  constructor(
    message: string,
    status: number,
    errors: Record<string, string[]> = {},
    code: string | null = null,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.code = code;
  }

  /** First validation message for a field, if the API rejected it. */
  fieldError(field: string): string | undefined {
    return this.errors[field]?.[0];
  }

  /** True when the request never reached the server (timeout, DNS, offline). */
  get isNetworkError(): boolean {
    return this.status === 0;
  }
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * fetch() with a hard upper bound. Rejects with an `ApiError` (status 0)
 * instead of leaving the caller awaiting forever if the network hangs or
 * the API doesn't respond in time - "no timeout" is exactly what let a slow
 * backend look like an infinite loading state on the client.
 */
async function fetchWithTimeout(
  input: string,
  init: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(
        "The request timed out. Please check your connection and try again.",
        0,
        {},
        "timeout",
      );
    }
    throw new ApiError(
      "Could not reach the server. Please check your connection and try again.",
      0,
      {},
      "network_error",
    );
  } finally {
    clearTimeout(timer);
  }
}

async function ensureCsrfCookie(force = false): Promise<void> {
  if (!force && readCookie("XSRF-TOKEN")) return;
  await fetchWithTimeout(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
}

/** Full envelope (data + meta), for callers that need pagination info etc. */
async function requestEnvelope<T>(
  path: string,
  options: RequestInit = {},
  retrying = false,
): Promise<ApiSuccess<T>> {
  const method = (options.method ?? "GET").toUpperCase();
  const isMutating = method !== "GET" && method !== "HEAD";

  if (isMutating) {
    await ensureCsrfCookie(retrying);
  }

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  // FormData bodies must NOT get an explicit Content-Type - the browser
  // sets the multipart boundary itself when it's left unset.
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (isMutating) {
    const token = readCookie("XSRF-TOKEN");
    if (token) headers.set("X-XSRF-TOKEN", token);
  }
  // Guarded to browser-only: this module is also called from Server
  // Components during SSR (e.g. the homepage's listProperties()), where
  // `document` doesn't exist. The backend's own locale-aware error/
  // validation messages only ever surface from client-triggered mutations
  // (form submissions), which always run in the browser, so this still
  // covers the case that matters.
  if (typeof document !== "undefined") {
    const locale = readCookie("NEXT_LOCALE");
    if (locale) headers.set("Accept-Language", locale);
  }

  const response = await fetchWithTimeout(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // A stale CSRF cookie (e.g. after a session change elsewhere) fails once
  // with 419 - refresh it and retry exactly once.
  if (response.status === 419 && !retrying) {
    return requestEnvelope<T>(path, options, true);
  }

  const payload =
    response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const failure = payload as ApiFailure | null;
    throw new ApiError(
      failure?.message ?? "Something went wrong. Please try again.",
      response.status,
      failure?.errors ?? {},
      failure?.code ?? null,
    );
  }

  return (
    response.status === 204 ? { success: true, data: null as T } : payload
  ) as ApiSuccess<T>;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const envelope = await requestEnvelope<T>(path, options);
  return envelope.data;
}

export const api = {
  get: <T,>(path: string) => request<T>(path),
  /** Same as `get`, but also returns the response's `meta` (e.g. pagination). */
  getWithMeta: <T,>(path: string) => requestEnvelope<T>(path),
  post: <T,>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T,>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T,>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T,>(path: string) => request<T>(path, { method: "DELETE" }),
  /** For multipart/form-data bodies (file uploads) - never JSON-encoded. */
  postForm: <T,>(path: string, body: FormData) =>
    request<T>(path, { method: "POST", body }),
  /**
   * PHP doesn't parse multipart bodies on PUT, so this sends POST with a
   * spoofed `_method=PUT` field instead - Laravel's method-spoofing
   * middleware is already active app-wide, no backend change needed.
   */
  putForm: <T,>(path: string, body: FormData) => {
    body.append("_method", "PUT");
    return request<T>(path, { method: "POST", body });
  },
};
