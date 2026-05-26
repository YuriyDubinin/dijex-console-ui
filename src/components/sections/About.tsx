import { Container } from '@/components/layout/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { PulsingImage } from '@/components/motion/PulsingImage';
import { motion } from 'framer-motion';
import { revealItemVariants } from '@/components/motion/variants';
import { MetricCard } from './MetricCard';
import { landing } from '@/content/landing';

export function About() {
  const { about } = landing;

  return (
    <section id="about" className="scroll-mt-20 py-24 md:py-32">
      <Container>
        {/* Two-column: text left, image right */}
        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
          <FadeIn className="flex flex-col gap-6">
            <div>
              <p className="text-small font-semibold uppercase tracking-[0.2em] text-accent-primary">
                О компании
              </p>
              <h2 className="mt-3 font-display text-h1 font-bold text-text-primary">
                {about.title}
              </h2>
            </div>
            <p className="text-body leading-relaxed text-text-secondary">{about.lead}</p>
            <p className="text-body leading-relaxed text-text-muted">{about.body}</p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="relative">
              {/* Glow behind card */}
              <div
                aria-hidden
                className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(99,102,241,0.3) 0%, transparent 70%)',
                }}
              />
              {/* Earth image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-bg-surface/60 backdrop-blur-sm">
                {/* Decorative grid behind */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0H0V40' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
                  }}
                />
                <PulsingImage
                  src="/earth.png"
                  alt="Цифровые решения для глобального бизнеса"
                  width={800}
                  height={600}
                  className="relative h-full w-full object-contain p-6"
                />
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Metrics grid */}
        <ScrollReveal
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 md:mt-20"
          staggerChildren={0.1}
        >
          {about.metrics.map((metric) => (
            <motion.div key={metric.label} variants={revealItemVariants}>
              <MetricCard metric={metric} />
            </motion.div>
          ))}
        </ScrollReveal>
      </Container>
    </section>
  );
}
