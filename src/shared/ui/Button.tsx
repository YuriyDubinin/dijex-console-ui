import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';
import { cn } from '../lib';

const variantClasses = {
  primary: [
    'bg-accent-primary text-white border border-transparent',
    'hover:bg-accent-primary/90 hover:shadow-glow',
    'active:bg-accent-primary/80',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
  ].join(' '),
  ghost: [
    'bg-transparent text-text-primary border border-border',
    'hover:border-accent-primary/60 hover:bg-bg-surface',
    'active:bg-bg-surface/80',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  link: [
    'bg-transparent text-accent-primary border border-transparent',
    'hover:text-accent-primary/80 underline-offset-4 hover:underline',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
} as const;

type Variant = keyof typeof variantClasses;

const sizeClasses = {
  sm: 'h-9 px-3 text-small gap-1.5',
  md: 'h-11 px-5 text-body gap-2',
  lg: 'h-14 px-7 text-body gap-2.5',
} as const;

type Size = keyof typeof sizeClasses;

type ButtonOwnProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

export type ButtonProps<E extends ElementType = 'button'> = ButtonOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps | 'as'>;

export function Button<E extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps<E>) {
  const Tag = (as ?? 'button') as ElementType;
  const isLink = variant === 'link';

  return (
    <Tag
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-xl',
        'transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
        'select-none',
        variantClasses[variant],
        isLink ? '' : sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
