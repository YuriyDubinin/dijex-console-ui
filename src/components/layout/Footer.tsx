import { Container } from './Container';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border bg-bg-base">
      <Container className="flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
        <p className="text-small text-text-muted">© {year} Dijex. Все права защищены.</p>
      </Container>
    </footer>
  );
}
