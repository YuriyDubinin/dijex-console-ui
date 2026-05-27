import { Card, Sparkline, UsageBar } from '@shared/ui';
import { cn } from '@shared/lib';
import { formatPercent, type SystemSnapshot } from '@entities/system';

export type KpiGaugesProps = {
  data: SystemSnapshot;
  sampledAt: string;
};

type GaugeProps = {
  label: string;
  caption: string;
  value: number;
  sampledAt: string;
};

function valueClass(percent: number): string {
  if (percent >= 90) return 'text-state-error';
  if (percent >= 75) return 'text-state-warning';
  return 'text-fg-primary';
}

function Gauge({ label, caption, value, sampledAt }: GaugeProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-fg-muted">
          {label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-fg-muted">
          {caption}
        </span>
      </div>
      <div className={cn('mt-2 font-mono text-3xl tabular-nums', valueClass(value))}>
        {formatPercent(value, 1)}
      </div>
      <div className="mt-2">
        <UsageBar percent={value} size="sm" />
      </div>
      <div className="mt-2">
        <Sparkline value={value} sampledAt={sampledAt} max={100} height={28} />
      </div>
    </Card>
  );
}

export function KpiGauges({ data, sampledAt }: KpiGaugesProps) {
  const rootPartition =
    data.disks.partitions.find((p) => p.mountpoint === '/') ?? data.disks.partitions[0];
  const dbPool = data.database.pool;
  const dbUtilization = dbPool.max_conns > 0 ? (dbPool.acquired_conns / dbPool.max_conns) * 100 : 0;

  return (
    <section
      aria-label="Live KPIs"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      <Gauge
        label="CPU"
        caption={`${data.cpu.logical_cores} cores`}
        value={data.cpu.usage_percent}
        sampledAt={sampledAt}
      />
      <Gauge
        label="Memory"
        caption="virtual"
        value={data.memory.virtual.used_percent}
        sampledAt={sampledAt}
      />
      <Gauge
        label="Disk"
        caption={rootPartition?.mountpoint ?? '—'}
        value={rootPartition?.used_percent ?? 0}
        sampledAt={sampledAt}
      />
      <Gauge
        label="DB pool"
        caption={`${dbPool.acquired_conns}/${dbPool.max_conns}`}
        value={dbUtilization}
        sampledAt={sampledAt}
      />
    </section>
  );
}
