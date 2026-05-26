import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Container } from './Container';
import { AnchorLink } from './AnchorLink';
import { cn } from '@/lib/cn';
import { landing } from '@/content/landing';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const NAV_IDS = landing.nav.map((n) => n.id);
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
  const activeId = useScrollSpy(NAV_IDS, { offset: 80 });
  const prefersReducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

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
        <AnchorLink
          href="/#hero"
          className="font-display text-xl font-bold tracking-tight text-text-primary hover:text-text-primary/90 md:text-2xl"
          aria-label="Dijex — на главную"
        >
          Dijex
        </AnchorLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Основная навигация">
          {landing.nav.map((item) => {
            const isActive = activeId === item.id;
            return (
              <AnchorLink
                key={item.id}
                href={item.href}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'rounded-lg px-3 py-2 text-small font-medium transition-colors',
                  isActive
                    ? 'text-text-primary'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                <span className="relative">
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 -bottom-1 h-px origin-left bg-gradient-to-r from-accent-primary to-accent-secondary transition-transform duration-300',
                      isActive ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </span>
              </AnchorLink>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <AnchorLink
            href="#contact"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-bg-surface/60 px-4 py-2 text-small font-semibold text-text-primary backdrop-blur-sm transition-all hover:border-accent-primary/60 hover:bg-bg-surface hover:shadow-glow"
          >
            Связаться
          </AnchorLink>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-bg-surface/60 text-text-primary backdrop-blur-sm md:hidden"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </Container>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
            className="border-t border-border bg-bg-base/95 backdrop-blur-md md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {landing.nav.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <AnchorLink
                    key={item.id}
                    href={item.href}
                    onNavigate={closeMenu}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'block min-h-[44px] rounded-lg px-3 py-3 text-body font-medium transition-colors',
                      isActive
                        ? 'bg-bg-surface text-text-primary'
                        : 'text-text-secondary hover:bg-bg-surface/60 hover:text-text-primary',
                    )}
                  >
                    {item.label}
                  </AnchorLink>
                );
              })}
              <AnchorLink
                href="#contact"
                onNavigate={closeMenu}
                className="mt-2 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-accent-primary px-4 py-3 text-body font-semibold text-white shadow-glow transition-colors hover:bg-accent-primary/90"
              >
                Связаться
              </AnchorLink>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
