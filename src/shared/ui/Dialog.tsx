import type { ReactNode } from 'react';
import * as RDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../lib';
import { IconButton } from './IconButton';

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Скрыть видимый заголовок, оставив его для скринридеров. */
  hideTitle?: boolean;
  /** Кнопки футера (например, <Button> Отмена</Button> <Button>OK</Button>). */
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  hideTitle,
  footer,
  className,
  children,
}: DialogProps) {
  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      <RDialog.Portal>
        <RDialog.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
            'data-[state=open]:animate-fade-in',
          )}
        />
        <RDialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[min(92vw,480px)] -translate-x-1/2 -translate-y-1/2',
            'rounded-md border border-border-subtle bg-bg-1 p-5',
            'focus:outline-none data-[state=open]:animate-dialog-in',
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {hideTitle ? (
                <RDialog.Title className="sr-only">{title}</RDialog.Title>
              ) : (
                <RDialog.Title className="text-sm font-semibold text-fg-primary">
                  {title}
                </RDialog.Title>
              )}
              {description ? (
                <RDialog.Description className="mt-1 text-xs text-fg-secondary">
                  {description}
                </RDialog.Description>
              ) : null}
            </div>
            <RDialog.Close asChild>
              <IconButton size="sm" aria-label="Закрыть диалог">
                <X size={14} aria-hidden />
              </IconButton>
            </RDialog.Close>
          </div>
          {children ? <div className="mt-4 text-sm text-fg-secondary">{children}</div> : null}
          {footer ? <div className="mt-5 flex items-center justify-end gap-2">{footer}</div> : null}
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
