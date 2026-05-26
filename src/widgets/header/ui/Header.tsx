import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@shared/ui';
import { cn } from '@shared/lib';

const SCROLL_THRESHOLD = 8;

function useIsScrolled(threshold = SCROLL_THRESHOLD): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > threshold);
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, [threshold]);

  return scrolled;
}

export function Header() {
  const scrolled = useIsScrolled();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-[background-color,border-color,backdrop-filter] duration-300',
        scrolled
          ? 'border-b border-border bg-bg-base/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          to="/"
          className="font-display text-xl font-bold tracking-tight text-text-primary hover:text-text-primary/90 md:text-2xl"
          aria-label="Dijex Console — на главную"
        >
          Dijex Console
        </Link>
      </Container>
    </header>
  );
}
