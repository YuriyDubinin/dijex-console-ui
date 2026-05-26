import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastProvider } from '@/components/ui/Toast';

function useScrollToHash() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    const id = hash.slice(1);
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    requestAnimationFrame(tryScroll);
  }, [pathname, hash, key]);
}

export function RootLayout() {
  useScrollToHash();

  return (
    <ToastProvider>
    <div className="flex min-h-screen flex-col bg-bg-base text-text-primary">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-bg-elevated focus:px-4 focus:py-2 focus:text-text-primary"
      >
        Перейти к основному контенту
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
    </ToastProvider>
  );
}
