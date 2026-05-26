import { motion, type HTMLMotionProps, type Transition } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type FadeInProps = {
  children: ReactNode;
  /** Задержка перед стартом, в секундах. */
  delay?: number;
  /** Длительность анимации, в секундах. */
  duration?: number;
  /** Сдвиг по Y в пикселях для эффекта «всплытия». */
  y?: number;
  /** Если true — анимация запускается на mount, иначе при появлении в viewport. */
  immediate?: boolean;
  className?: string;
} & Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'whileInView' | 'transition' | 'children'>;

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  y = 16,
  immediate = false,
  className,
  ...rest
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={className} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  const transition: Transition = { duration, delay, ease: 'easeOut' };

  const hidden = { opacity: 0, y };
  const visible = { opacity: 1, y: 0 };

  if (immediate) {
    return (
      <motion.div
        className={className}
        initial={hidden}
        animate={visible}
        transition={transition}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={{ once: true, amount: 0.2 }}
      transition={transition}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
