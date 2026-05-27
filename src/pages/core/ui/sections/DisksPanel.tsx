import { useRef } from 'react';
import { Card, Chip, UsageBar } from '@shared/ui';
import {
  formatBytes,
  formatBytesPerSecond,
  formatPercent,
  type SystemDisks,
} from '@entities/system';
import { PanelTitle } from './PanelTitle';

export type DisksPanelProps = {
  disks: SystemDisks;
  sampledAt: string;
};

type RateSnapshot = {
  sampledAt: string;
  byDevice: Record<string, { readBytes: number; writeBytes: number }>;
};

/**
 * Считает rate (bytes/sec) по дельте между текущим и предыдущим снапшотом для каждой
 * device. Дельта считается на основе ISO разницы времени.
 */
function useIoRates(disks: SystemDisks, sampledAt: string) {
  const prevRef = useRef<RateSnapshot | null>(null);
  const rates: Record<string, { readRate: number; writeRate: number }> = {};

  if (disks.io_counters) {
    const prev = prevRef.current;
    const dtSec =
      prev && prev.sampledAt
        ? (new Date(sampledAt).getTime() - new Date(prev.sampledAt).getTime()) / 1000
        : 0;

    for (const [device, c] of Object.entries(disks.io_counters)) {
      const prevDev = prev?.byDevice[device];
      if (prevDev && dtSec > 0) {
        const dr = Math.max(0, c.read_bytes - prevDev.readBytes);
        const dw = Math.max(0, c.write_bytes - prevDev.writeBytes);
        rates[device] = { readRate: dr / dtSec, writeRate: dw / dtSec };
      } else {
        rates[device] = { readRate: 0, writeRate: 0 };
      }
    }

    // Сохраняем как prev для следующего рендера.
    prevRef.current = {
      sampledAt,
      byDevice: Object.fromEntries(
        Object.entries(disks.io_counters).map(([dev, c]) => [
          dev,
          { readBytes: c.read_bytes, writeBytes: c.write_bytes },
        ]),
      ),
    };
  }

  return rates;
}

export function DisksPanel({ disks, sampledAt }: DisksPanelProps) {
  const rates = useIoRates(disks, sampledAt);
  // Сортируем партиции: корень первым, дальше — по убыванию used_percent.
  const sorted = [...disks.partitions].sort((a, b) => {
    if (a.mountpoint === '/') return -1;
    if (b.mountpoint === '/') return 1;
    return b.used_percent - a.used_percent;
  });

  return (
    <Card className="flex flex-col gap-3">
      <PanelTitle
        title="Disks"
        subtitle={`// ${disks.partitions.length} partition${disks.partitions.length === 1 ? '' : 's'}`}
      />

      <ul className="divide-y divide-border-subtle">
        {sorted.map((p) => {
          const ioKey = p.device.replace(/^\/dev\//, '');
          const rate = rates[ioKey] ?? rates[p.device];
          return (
            <li key={p.device + p.mountpoint} className="py-2.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex min-w-0 items-baseline gap-2">
                  <span className="truncate font-mono text-xs text-fg-primary">
                    {p.mountpoint}
                  </span>
                  <Chip tone="neutral" mono>
                    {p.fstype || '—'}
                  </Chip>
                  <span className="truncate font-mono text-[10px] text-fg-muted">
                    {p.device}
                  </span>
                </div>
                <span className="font-mono text-xs tabular-nums text-fg-secondary">
                  {formatBytes(p.used_bytes)} / {formatBytes(p.total_bytes)}{' '}
                  <span className="text-fg-muted">· {formatPercent(p.used_percent, 1)}</span>
                </span>
              </div>
              <div className="mt-2">
                <UsageBar percent={p.used_percent} size="sm" />
              </div>
              {rate ? (
                <div className="mt-1.5 flex items-baseline gap-3 font-mono text-[10px] text-fg-muted">
                  <span>read {formatBytesPerSecond(rate.readRate)}</span>
                  <span>write {formatBytesPerSecond(rate.writeRate)}</span>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
