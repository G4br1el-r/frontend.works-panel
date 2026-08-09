import { httpErrorFromStatus, NetworkError, TimeoutError } from "./errors";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface NextCacheOptions {
  revalidate?: number | false;
  tags?: string[];
}

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextCacheOptions;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface ApiClientConfig {
  baseUrl: string;
  apiKey?: string;
  getToken?: () => string | undefined | Promise<string | undefined>;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
}

export interface ApiClient {
  request<T>(path: string, options?: RequestOptions): Promise<T>;
  get<T>(
    path: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T>;
  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T>;
  put<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T>;
  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T>;
  delete<T>(
    path: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T>;
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  const {
    baseUrl,
    apiKey,
    getToken,
    defaultHeaders,
    timeoutMs: defaultTimeoutMs,
  } = config;

  async function request<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const {
      method = "GET",
      body,
      token: tokenOverride,
      headers = {},
      cache,
      next,
      signal,
      timeoutMs = defaultTimeoutMs,
    } = options;

    const token = tokenOverride ?? (await getToken?.());
    const timeout = createTimeout(timeoutMs, signal);

    let response: Response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
          ...(apiKey ? { "x-api-key": apiKey } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...defaultHeaders,
          ...headers,
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        ...(cache ? { cache } : {}),
        ...(next ? { next } : {}),
        signal: timeout.signal,
      } as RequestInit & { next?: NextCacheOptions });
    } catch (error) {
      if (error instanceof TimeoutError) throw error;
      throw new NetworkError(undefined, { cause: error });
    } finally {
      timeout.clear();
    }

    if (!response.ok) {
      const { data, raw } = await safeParseBody(response);
      const message = extractMessage(data) ?? raw ?? `HTTP ${response.status}`;
      throw httpErrorFromStatus(response.status, message, {
        details: data ?? raw,
      });
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const { data } = await safeParseBody(response);
    return data as T;
  }

  return {
    request,
    get: (path, options) => request(path, { ...options, method: "GET" }),
    post: (path, body, options) =>
      request(path, { ...options, method: "POST", body }),
    put: (path, body, options) =>
      request(path, { ...options, method: "PUT", body }),
    patch: (path, body, options) =>
      request(path, { ...options, method: "PATCH", body }),
    delete: (path, options) => request(path, { ...options, method: "DELETE" }),
  };
}

function createTimeout(
  timeoutMs: number | undefined,
  externalSignal: AbortSignal | undefined,
) {
  if (!timeoutMs) {
    return { signal: externalSignal, clear: () => {} };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(new TimeoutError()),
    timeoutMs,
  );

  externalSignal?.addEventListener(
    "abort",
    () => controller.abort(externalSignal.reason),
    {
      once: true,
    },
  );

  return { signal: controller.signal, clear: () => clearTimeout(timeoutId) };
}

async function safeParseBody(
  response: Response,
): Promise<{ data: unknown; raw?: string }> {
  const raw = await response.text().catch(() => undefined);
  if (!raw) return { data: undefined };

  try {
    return { data: JSON.parse(raw), raw };
  } catch {
    return { data: undefined, raw };
  }
}

function extractMessage(data: unknown): string | undefined {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    const nested = record.error as Record<string, unknown> | undefined;

    if (nested && typeof nested.message === "string") {
      return nested.message;
    }
    if (typeof record.message === "string") {
      return record.message;
    }
  }

  return undefined;
}
