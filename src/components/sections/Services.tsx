import { Container } from '@/components/layout/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { ServiceCard } from './ServiceCard';
import { landing } from '@/content/landing';

export function Services() {
  const { services } = landing;

  return (
    <section
      id="services"
      className="scroll-mt-20 border-t border-border/40 py-24 md:py-32"
    >
      <Container>
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-small font-semibold uppercase tracking-[0.2em] text-accent-primary">
            Услуги
          </p>
          <h2 className="mt-3 font-display text-h1 font-bold text-text-primary">
            {services.title}
          </h2>
          <p className="mt-4 text-body text-text-secondary">{services.lead}</p>
        </FadeIn>

        <ScrollReveal
          className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          staggerChildren={0.08}
        >
          {services.items.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </ScrollReveal>
      </Container>
    </section>
  );
}
