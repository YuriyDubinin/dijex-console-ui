import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type ScrollRevealProps = {
  children: ReactNode;
  /** Пауза между анимациями детей при stagger. */
  staggerChildren?: number;
  /** Начальная задержка для всего контейнера. */
  delayChildren?: number;
  className?: string;
} & Omit<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'variants' | 'viewport' | 'children'>;

const containerVariants: Variants = {
  hidden: {},
  visible: {},
};

/**
 * Контейнер для stagger-появления. Дочерние motion-элементы должны использовать
 * variants из @/components/motion/variants (revealItemVariants) или собственные
 * с теми же ключами ('hidden' / 'visible').
 *
 * При prefers-reduced-motion рендерится без анимаций.
 */
export function ScrollReveal({
  children,
  staggerChildren = 0.08,
  delayChildren = 0,
  className,
  ...rest
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={className} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        ...containerVariants,
        visible: { transition: { staggerChildren, delayChildren } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
