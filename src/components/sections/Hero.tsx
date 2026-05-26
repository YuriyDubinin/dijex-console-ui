import { motion, type Variants } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { AnchorLink } from '@/components/layout/AnchorLink';
import { Button } from '@/components/ui/Button';
import { HeroBackground } from './HeroBackground';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { landing } from '@/content/landing';

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const { hero } = landing;

  const containerVariants = prefersReducedMotion ? undefined : staggerContainer;
  const containerInitial = prefersReducedMotion ? false : 'hidden';
  const containerAnimate = prefersReducedMotion ? {} : 'visible';
  const itemVariants = prefersReducedMotion ? undefined : staggerItem;

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] scroll-mt-20 flex-col items-center justify-center overflow-hidden py-24"
    >
      <HeroBackground />

      <Container className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial={containerInitial}
          animate={containerAnimate}
          className="flex flex-col items-center gap-8 md:gap-10"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-surface/60 px-4 py-1.5 text-small text-text-secondary backdrop-blur-sm">
              {hero.badge}
            </span>
          </motion.div>

          {/* H1 */}
          <motion.div variants={itemVariants}>
            <h1 className="max-w-4xl font-display text-display font-bold leading-[1.05] tracking-tight text-text-primary">
              {hero.title}
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div variants={itemVariants}>
            <p className="max-w-2xl text-body text-text-secondary md:text-lg">{hero.subtitle}</p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Button as={AnchorLink} href={hero.primaryCta.href} variant="primary" size="lg">
              {hero.primaryCta.label}
              <ArrowRight size={18} aria-hidden />
            </Button>
            <Button as={AnchorLink} href={hero.secondaryCta.href} variant="ghost" size="lg">
              {hero.secondaryCta.label}
            </Button>
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll caret */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0], y: [0, 6, 0] }}
          transition={{ delay: 1.4, duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        >
          <ChevronDown size={24} />
        </motion.div>
      )}
    </section>
  );
}
