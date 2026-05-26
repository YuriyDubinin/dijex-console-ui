import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export function Field({
  label,
  htmlFor,
  error,
  required,
  hint,
  className,
  children,
}: FieldProps) {
  const errorId = `${htmlFor}-error`;
  const hintId = `${htmlFor}-hint`;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="text-small font-medium text-text-secondary"
      >
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-danger">
            *
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-small text-text-muted">
          {hint}
        </p>
      )}

      {children}

      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="text-small text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}
