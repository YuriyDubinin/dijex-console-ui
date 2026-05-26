import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/Toast';
import { ContactForm } from './ContactForm';

const mockFetch = vi.fn();

function makeResponse(status: number, data?: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data ?? {}),
  } as Response;
}

function renderForm() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <ContactForm />
      </ToastProvider>
    </MemoryRouter>,
  );
}

/** Fill all required fields and blur each to trigger onBlur validation */
async function fillRequired(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Имя/), 'Иван Иванов');
  await user.tab();
  await user.type(screen.getByLabelText(/^Email/), 'ivan@example.com');
  await user.tab();
  await user.type(screen.getByLabelText(/^Сообщение/), 'Это тестовое сообщение, достаточно длинное.');
  await user.tab();
}

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ContactForm', () => {
  it('renders all form fields', () => {
    renderForm();
    expect(screen.getByLabelText(/^Имя/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Телефон/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Тема/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Сообщение/)).toBeInTheDocument();
  });

  it('shows validation error and blocks submit for too-short name', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/^Имя/), 'И');
    await user.tab();

    expect(await screen.findByText('Минимум 2 символа')).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /отправить заявку/i });
    expect(submitBtn).toBeDisabled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('calls fetch with correct body on valid submit', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(
      makeResponse(200, { id: '1', status: 'pending', created_at: '2026-01-01' }),
    );

    renderForm();
    await fillRequired(user);

    const submitBtn = await screen.findByRole('button', { name: /отправить заявку/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    await user.click(submitBtn);

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/feedbacks/requests');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body.name).toBe('Иван Иванов');
    expect(body.email).toBe('ivan@example.com');
  });

  it('shows success card after successful submit', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(
      makeResponse(200, { id: '1', status: 'pending', created_at: '2026-01-01' }),
    );

    renderForm();
    await fillRequired(user);

    const submitBtn = await screen.findByRole('button', { name: /отправить заявку/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    await user.click(submitBtn);

    expect(await screen.findByText(/спасибо/i)).toBeInTheDocument();
  });

  it('maps 422 details to field errors', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(
      makeResponse(422, {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: [{ field: 'email', message: 'Этот email уже зарегистрирован' }],
        },
      }),
    );

    renderForm();
    await fillRequired(user);

    const submitBtn = await screen.findByRole('button', { name: /отправить заявку/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    await user.click(submitBtn);

    expect(await screen.findByText('Этот email уже зарегистрирован')).toBeInTheDocument();
  });

  it('shows error toast on 500 response', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValue(makeResponse(500));

    renderForm();
    await fillRequired(user);

    const submitBtn = await screen.findByRole('button', { name: /отправить заявку/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    await user.click(submitBtn);

    expect(await screen.findByText(/что-то пошло не так/i)).toBeInTheDocument();
  });

  it('does not call fetch when honeypot is filled', async () => {
    const user = userEvent.setup();
    renderForm();
    await fillRequired(user);

    const submitBtn = await screen.findByRole('button', { name: /отправить заявку/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    // Simulate bot filling the hidden honeypot field
    const honeypot = document.querySelector('input[name="website"]') as HTMLInputElement;
    Object.defineProperty(honeypot, 'value', { value: 'http://spam.com', writable: true });

    await user.click(submitBtn);

    await waitFor(() =>
      expect(screen.queryByText(/спасибо/i)).toBeInTheDocument(),
    );
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('disables submit button while submitting (no double submit)', async () => {
    const user = userEvent.setup();
    let resolveRequest!: (v: Response) => void;
    mockFetch.mockReturnValue(
      new Promise<Response>((r) => {
        resolveRequest = r;
      }),
    );

    renderForm();
    await fillRequired(user);

    const submitBtn = await screen.findByRole('button', { name: /отправить заявку/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
    await user.click(submitBtn);

    expect(await screen.findByText(/отправляем/i)).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Resolve and let React flush state updates
    resolveRequest(makeResponse(200, { id: '1', status: 'pending', created_at: '2026-01-01' }));
    await waitFor(() => expect(screen.queryByText(/спасибо/i)).toBeInTheDocument());
  });
});
