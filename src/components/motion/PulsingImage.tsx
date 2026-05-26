import { motion, useReducedMotion } from 'framer-motion';

type PulsingImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onError?: React.ReactEventHandler<HTMLImageElement>;
};

/**
 * Изображение с медленной пульсацией прозрачности (eye-candy эффект).
 * При prefers-reduced-motion анимация отключается.
 */
export function PulsingImage({
  src,
  alt,
  className,
  width,
  height,
  onError,
}: PulsingImageProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={className}
      onError={onError}
      animate={shouldReduceMotion ? undefined : { opacity: [0.25, 1, 0.25] }}
      transition={
        shouldReduceMotion
          ? undefined
          : {
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }
      }
    />
  );
}
