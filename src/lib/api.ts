import type { FeedbackInput } from '@/schemas/feedback';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export type FeedbackResponse = {
  id: string;
  status: string;
  created_at: string;
};

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

export async function submitFeedback(input: FeedbackInput): Promise<FeedbackResponse> {
  const res = await fetch(`${API_BASE}/api/feedbacks/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as { error?: ApiErrorPayload } | null;
    throw new ApiError(res.status, payload?.error);
  }

  return (await res.json()) as FeedbackResponse;
}
