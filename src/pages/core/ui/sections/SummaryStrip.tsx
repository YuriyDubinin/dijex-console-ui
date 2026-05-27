import { useEffect, useState } from 'react';
import { Chip } from '@shared/ui';
import {
  deriveHealth,
  formatUptime,
  healthLabel,
  healthTone,
  type SystemSnapshot,
} from '@entities/system';
import { LiveIndicator } from './LiveIndicator';

export type SummaryStripProps = {
  data: SystemSnapshot;
  fetching: boolean;
  pollIntervalMs: number;
};

/**
 * Локальный «живой» счётчик: тикает между поллингами от app.uptime_seconds.
 * Сбрасывается на каждый новый снапшот.
 */
function useTickingUptime(initialSeconds: number, anchor: string): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    setTick(0);
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [anchor]);
  return Math.floor(initialSeconds + tick);
}

export function SummaryStrip({ data, fetching, pollIntervalMs }: SummaryStripProps) {
  const health = deriveHealth(data);
  const liveUptime = useTickingUptime(data.app.uptime_seconds, data.collected_at);

  return (
    <section
      aria-label="System summary"
      className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-border-subtle bg-bg-1 px-4 py-3"
    >
      <div className="flex flex-wrap items-center gap-3">
        <Chip tone={healthTone(health.status)} mono>
          {healthLabel(health.status)}
        </Chip>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-semibold text-fg-primary">{data.app.name}</span>
          <span className="font-mono text-xs text-fg-muted">v{data.app.version}</span>
          <Chip tone={data.app.env === 'production' ? 'accent' : 'info'} mono>
            {data.app.env.toUpperCase()}
          </Chip>
        </div>
        <span className="font-mono text-xs text-fg-muted">·</span>
        <span className="truncate font-mono text-xs text-fg-secondary">{data.host.hostname}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-fg-muted">
          {data.host.os}/{data.host.kernel_arch}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="font-mono text-xs text-fg-secondary">
          <span className="text-fg-muted">uptime </span>
          {formatUptime(liveUptime)}
        </div>
        <LiveIndicator fetching={fetching} intervalMs={pollIntervalMs} />
      </div>
    </section>
  );
}
