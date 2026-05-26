import { Toaster as SonnerToaster } from 'sonner';

/**
 * Корневой mount-point для тостов Sonner. Монтировать один раз в RootLayout.
 * Стили унифицированы под палитру: тёмный фон, тонкая левая полоса по типу,
 * моноширинный код-чип в правом углу (через NotifyOptions.code).
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="dark"
      duration={4000}
      visibleToasts={5}
      gap={8}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast: [
            'group',
            'relative !w-[360px] !max-w-[92vw]',
            'rounded-md border border-border-subtle bg-bg-3 text-fg-primary',
            'px-3 py-2.5 text-sm',
            'border-l-2',
          ].join(' '),
          title: 'text-sm font-medium text-fg-primary',
          description: 'text-xs text-fg-secondary mt-0.5',
          actionButton:
            '!bg-accent !text-accent-on !text-xs !font-medium !rounded-md !px-2 !py-1',
          cancelButton:
            '!bg-transparent !text-fg-secondary !text-xs !rounded-md !px-2 !py-1',
          closeButton:
            '!bg-transparent !text-fg-muted hover:!text-fg-primary !border-0',
          success: '!border-l-state-success',
          error: '!border-l-state-error',
          warning: '!border-l-state-warning',
          info: '!border-l-state-info',
          loading: '!border-l-border-strong',
          default: '!border-l-border-strong',
        },
      }}
    />
  );
}
