import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { FadeIn } from '@/components/motion/FadeIn';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { revealItemVariants } from '@/components/motion/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import { landing, type ProcessStep } from '@/content/landing';

function StepCard({ step }: { step: ProcessStep }) {
  return (
    <motion.div
      variants={revealItemVariants}
      className="relative flex flex-1 flex-col gap-3 rounded-2xl border border-border bg-bg-surface/60 p-6 backdrop-blur-sm"
    >
      <span
        aria-hidden
        className={cn(
          'font-display text-h1 font-bold leading-none tracking-tight',
          'bg-gradient-to-br from-accent-primary via-accent-glow to-accent-secondary bg-clip-text text-transparent',
        )}
      >
        {step.number}
      </span>
      <h3 className="font-display text-h3 font-semibold text-text-primary">
        {step.title}
      </h3>
      <p className="text-body leading-relaxed text-text-secondary">
        {step.description}
      </p>
    </motion.div>
  );
}

export function Process() {
  const { process } = landing;
  const prefersReducedMotion = useReducedMotion();

  // Line animation: 0 → 1 along the appropriate axis, single transition triggered when section enters viewport.
  const lineTransition = { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 };

  return (
    <section
      id="process"
      className="scroll-mt-20 border-t border-border/40 py-24 md:py-32"
    >
      <Container>
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-small font-semibold uppercase tracking-[0.2em] text-accent-primary">
            Процесс
          </p>
          <h2 className="mt-3 font-display text-h1 font-bold text-text-primary">
            {process.title}
          </h2>
          <p className="mt-4 text-body text-text-secondary">{process.lead}</p>
        </FadeIn>

        {/* Desktop: horizontal layout with animated horizontal line behind cards */}
        <div className="relative mt-16 hidden lg:block">
          <div className="absolute left-0 right-0 top-[88px] h-px overflow-hidden">
            <motion.div
              aria-hidden
              initial={prefersReducedMotion ? false : { scaleX: 0 }}
              whileInView={prefersReducedMotion ? undefined : { scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={lineTransition}
              style={{ originX: 0 }}
              className="h-full w-full bg-gradient-to-r from-transparent via-accent-primary/60 to-transparent"
            />
          </div>

          <ScrollReveal
            className="relative flex items-stretch gap-4"
            staggerChildren={0.12}
            delayChildren={0.1}
          >
            {process.steps.map((step) => (
              <StepCard key={step.id} step={step} />
            ))}
          </ScrollReveal>
        </div>

        {/* Mobile / tablet: vertical layout with animated vertical line on the left */}
        <div className="relative mt-16 lg:hidden">
          <div className="absolute bottom-0 left-6 top-0 w-px overflow-hidden">
            <motion.div
              aria-hidden
              initial={prefersReducedMotion ? false : { scaleY: 0 }}
              whileInView={prefersReducedMotion ? undefined : { scaleY: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={lineTransition}
              style={{ originY: 0 }}
              className="h-full w-full bg-gradient-to-b from-transparent via-accent-primary/60 to-transparent"
            />
          </div>

          <ScrollReveal
            className="relative flex flex-col gap-6 pl-16"
            staggerChildren={0.1}
          >
            {process.steps.map((step) => (
              <div key={step.id} className="relative">
                <div
                  aria-hidden
                  className="absolute -left-[42px] top-6 h-3 w-3 -translate-x-1/2 rounded-full border border-accent-primary/40 bg-bg-base"
                />
                <StepCard step={step} />
              </div>
            ))}
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
