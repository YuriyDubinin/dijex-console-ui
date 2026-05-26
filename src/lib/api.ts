const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export type ApiErrorDetail = {
  field: string;
  message: string;
};

export type ApiErrorPayload = {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly payload?: ApiErrorPayload;

  constructor(status: number, payload?: ApiErrorPayload) {
    super(payload?.message ?? `HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

export async function apiRequest<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { method = 'GET', body, signal, headers = {} } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    signal,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as { error?: ApiErrorPayload } | null;
    throw new ApiError(res.status, payload?.error);
  }

  if (res.status === 204) return undefined as TResponse;
  return (await res.json()) as TResponse;
}

export type PingResponse = { status: string };

export function ping(signal?: AbortSignal): Promise<PingResponse> {
  return apiRequest<PingResponse>('/api/ping', { signal });
}
