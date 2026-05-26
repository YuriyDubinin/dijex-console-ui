import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';

export type UseCountUpOptions = {
  duration?: number;
  ease?: 'easeOut' | 'linear' | 'easeIn';
};

export function useCountUp(
  target: number,
  { duration = 1.8, ease = 'easeOut' }: UseCountUpOptions = {},
): { value: number; ref: React.RefObject<HTMLElement> } {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;

    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    const controls = animate(0, target, {
      duration,
      ease,
      onUpdate: (v) => setValue(Math.round(v)),
    });

    return () => controls.stop();
  }, [inView, target, duration, ease, prefersReducedMotion]);

  return { value, ref };
}
