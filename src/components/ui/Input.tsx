import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type InputProps = {
  hasError?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, hasError, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-lg border bg-bg-surface/60 px-4 py-3',
        'text-body text-text-primary placeholder:text-text-muted',
        'backdrop-blur-sm transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-bg-base',
        'disabled:cursor-not-allowed disabled:opacity-50',
        hasError
          ? 'border-danger focus:border-danger focus:ring-danger/30'
          : 'border-border focus:border-accent-primary focus:ring-accent-primary/20',
        className,
      )}
      aria-invalid={hasError ? true : undefined}
      {...rest}
    />
  );
});
