import { Container } from '@/components/layout/Container';
import { FadeIn } from '@/components/motion/FadeIn';

export function HomePage() {
  return (
    <Container className="py-24 md:py-32">
      <FadeIn immediate>
        <h1 className="font-display text-display font-bold tracking-tight text-text-primary">
          Dijex Console
        </h1>
        <p className="mt-6 max-w-2xl text-body text-text-secondary">
          Пустой шаблон консоли. Здесь появится интерфейс приложения.
        </p>
      </FadeIn>
    </Container>
  );
}
