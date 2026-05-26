import { Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container';

export function ThanksPage() {
  return (
    <Container className="py-24 md:py-32">
      <h1 className="font-display text-h1 font-bold text-text-primary">Спасибо!</h1>
      <p className="mt-6 max-w-2xl text-body text-text-secondary">
        Мы получили вашу заявку и свяжемся с вами в течение рабочего дня.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-xl border border-border bg-bg-surface/60 px-4 py-2 text-small font-semibold text-text-primary backdrop-blur-sm transition-colors hover:border-accent-primary/60 hover:bg-bg-surface"
      >
        На главную
      </Link>
    </Container>
  );
}
