import { cn } from '@/lib/cn';
import { useCountUp } from '@/hooks/useCountUp';
import type { Metric } from '@/content/landing';

type MetricCardProps = {
  metric: Metric;
  className?: string;
};

export function MetricCard({ metric, className }: MetricCardProps) {
  const { value, ref } = useCountUp(metric.value, { duration: 2 });

  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-2xl border border-border bg-bg-surface/60 p-6 backdrop-blur-sm',
        className,
      )}
    >
      <p
        ref={ref as React.RefObject<HTMLParagraphElement>}
        className="font-display text-h1 font-bold tabular-nums leading-none text-text-primary"
        aria-label={`${metric.value}${metric.suffix ?? ''}`}
      >
        {value}
        {metric.suffix ? (
          <span className="text-accent-primary">{metric.suffix}</span>
        ) : null}
      </p>
      <p className="text-small text-text-secondary">{metric.label}</p>
    </div>
  );
}
