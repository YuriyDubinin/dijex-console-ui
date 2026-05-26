import { Container } from '@/components/layout/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { landing, type TechItem } from '@/content/landing';

function TechPill({ item }: { item: TechItem }) {
  return (
    <li
      className={cn(
        'flex shrink-0 items-center gap-2 rounded-xl border border-border bg-bg-surface/60 px-5 py-2.5',
        'text-body font-medium text-text-secondary backdrop-blur-sm',
      )}
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-accent-primary"
      />
      {item.name}
    </li>
  );
}

export function TechStack() {
  const { techStack } = landing;
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="tech"
      className="scroll-mt-20 border-t border-border/40 py-20 md:py-24"
      aria-label={techStack.title}
    >
      <Container>
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-small font-semibold uppercase tracking-[0.2em] text-accent-primary">
            Стек
          </p>
          <h2 className="mt-3 font-display text-h2 font-bold text-text-primary">
            {techStack.title}
          </h2>
          <p className="mt-3 text-body text-text-secondary">{techStack.lead}</p>
        </FadeIn>
      </Container>

      <div className="mt-10">
        {prefersReducedMotion ? (
          <Container>
            <ul className="flex flex-wrap justify-center gap-3">
              {techStack.items.map((item) => (
                <TechPill key={item.name} item={item} />
              ))}
            </ul>
          </Container>
        ) : (
          <div
            className="group relative overflow-hidden"
            aria-label="Технологии в стеке"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg-base to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg-base to-transparent"
            />
            <ul className="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused]">
              {[...techStack.items, ...techStack.items].map((item, index) => (
                <TechPill key={`${item.name}-${index}`} item={item} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
