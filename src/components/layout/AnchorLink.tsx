import { forwardRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/cn';

export type AnchorLinkProps = {
  /** Якорь вида `#about` или `/path#about`. */
  href: string;
  children: ReactNode;
  /** Колбэк после клика — например, чтобы закрыть мобильное меню. */
  onNavigate?: () => void;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>;

/**
 * Якорная ссылка с плавным скроллом.
 * - На главной (`/`) перехватывает клик, делает scrollIntoView и обновляет hash без скачка.
 * - С других страниц (например, `/privacy`) делает SPA-навигацию на `/` + hash.
 */
export const AnchorLink = forwardRef<HTMLAnchorElement, AnchorLinkProps>(function AnchorLink(
  { href, children, onNavigate, className, ...rest },
  ref,
) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    const targetPath = href.slice(0, hashIndex) || '/';
    const targetId = href.slice(hashIndex + 1);

    if (location.pathname !== targetPath) {
      event.preventDefault();
      navigate(`${targetPath}#${targetId}`);
      onNavigate?.();
      return;
    }

    const element = document.getElementById(targetId);
    if (!element) return;

    event.preventDefault();
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${targetId}`);
    onNavigate?.();
  };

  return (
    <a ref={ref} href={href} onClick={handleClick} className={cn(className)} {...rest}>
      {children}
    </a>
  );
});
