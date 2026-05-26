import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-bg-surface/60 px-3 py-1',
        'text-small font-medium text-text-secondary backdrop-blur-sm',
        className,
      )}
    >
      {children}
    </span>
  );
}
