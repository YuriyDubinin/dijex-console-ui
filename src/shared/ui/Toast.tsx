/* eslint-disable react-refresh/only-export-components -- Provider and hook are intentionally co-located */
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { cn } from '../lib';

type ToastVariant = 'success' | 'error';

type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  show: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
};

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success:
    'border-success/30 bg-bg-elevated text-success',
  error:
    'border-danger/30 bg-bg-elevated text-danger',
};

const AUTO_DISMISS_MS = 5000;

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const Icon = ICONS[toast.variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      role="alert"
      aria-live="polite"
      className={cn(
        'flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg',
        VARIANT_CLASSES[toast.variant],
      )}
    >
      <Icon size={18} aria-hidden className="mt-0.5 shrink-0" />
      <p className="flex-1 text-small text-text-primary">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Закрыть уведомление"
        className="shrink-0 rounded text-text-muted hover:text-text-primary transition-colors"
      >
        <X size={16} aria-hidden />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const baseId = useId();

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant = 'error') => {
      const id = `${baseId}-${Date.now()}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [baseId, dismiss],
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {createPortal(
        <div
          aria-label="Уведомления"
          className="pointer-events-none fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2 sm:right-6"
        >
          <AnimatePresence mode="sync">
            {toasts.map((toast) => (
              <div key={toast.id} className="pointer-events-auto">
                <ToastItem toast={toast} onDismiss={dismiss} />
              </div>
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
