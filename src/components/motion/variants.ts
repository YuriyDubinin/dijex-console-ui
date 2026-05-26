import type { Variants } from 'framer-motion';

/**
 * Стандартный набор variants для дочерних элементов внутри <ScrollReveal>.
 * Используется для stagger-появления карточек, списков и т. п.
 */
export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};
