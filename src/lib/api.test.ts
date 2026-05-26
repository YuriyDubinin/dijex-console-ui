import { describe, it, expect } from 'vitest';
import { ApiError } from './api';

describe('ApiError', () => {
  it('uses payload message when present', () => {
    const err = new ApiError(422, {
      code: 'validation_error',
      message: 'Bad input',
      details: [{ field: 'name', message: 'required' }],
    });
    expect(err.status).toBe(422);
    expect(err.message).toBe('Bad input');
    expect(err.payload?.details?.[0]?.field).toBe('name');
  });

  it('falls back to HTTP status when payload is missing', () => {
    const err = new ApiError(500);
    expect(err.message).toBe('HTTP 500');
    expect(err.payload).toBeUndefined();
  });
});
