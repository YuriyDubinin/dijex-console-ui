import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Brain,
  Cloud,
  Code,
  Database,
  Shield,
  Smartphone,
  Sparkles,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { revealItemVariants } from '@/components/motion/variants';
import { cn } from '@/lib/cn';
import type { Service } from '@/content/landing';

const ICON_MAP: Record<Service['iconKey'], LucideIcon> = {
  code: Code,
  smartphone: Smartphone,
  brain: Brain,
  cloud: Cloud,
  database: Database,
  shield: Shield,
  workflow: Workflow,
  sparkles: Sparkles,
};

type ServiceCardProps = {
  service: Service;
  className?: string;
};

export function ServiceCard({ service, className }: ServiceCardProps) {
  const Icon = ICON_MAP[service.iconKey];

  return (
    <motion.article
      variants={revealItemVariants}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'group relative flex flex-col gap-4 rounded-2xl border border-border bg-bg-surface/60 p-6 backdrop-blur-sm',
        'transition-shadow duration-300 hover:border-accent-primary/40 hover:shadow-glow',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
        style={{
          background:
            'radial-gradient(circle at 30% 0%, rgba(99,102,241,0.25) 0%, transparent 60%)',
        }}
      />

      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-primary/20 bg-accent-primary/10 text-accent-primary">
        <Icon size={22} aria-hidden />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-display text-h3 font-semibold text-text-primary">
          {service.title}
        </h3>
        <p className="text-body leading-relaxed text-text-secondary">
          {service.description}
        </p>
      </div>

      <a
        href={`#${service.id}`}
        className="mt-auto inline-flex items-center gap-1.5 text-small font-medium text-accent-primary transition-colors hover:text-accent-secondary"
        aria-label={`Узнать больше: ${service.title}`}
      >
        Узнать больше
        <ArrowUpRight
          size={16}
          aria-hidden
          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </motion.article>
  );
}
