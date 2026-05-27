import { useRef } from 'react';
import { Card, Chip, StatField } from '@shared/ui';
import {
  formatBytes,
  formatBytesPerSecond,
  formatCount,
  type SystemNetwork,
} from '@entities/system';
import { PanelTitle } from './PanelTitle';

export type NetworkPanelProps = {
  network: SystemNetwork;
  sampledAt: string;
};

type Snapshot = {
  sampledAt: string;
  byName: Record<string, { sent: number; recv: number }>;
};

function useNetRates(network: SystemNetwork, sampledAt: string) {
  const prevRef = useRef<Snapshot | null>(null);
  const rates: Record<string, { sentRate: number; recvRate: number }> = {};

  const prev = prevRef.current;
  const dtSec = prev
    ? (new Date(sampledAt).getTime() - new Date(prev.sampledAt).getTime()) / 1000
    : 0;

  for (const c of network.io_counters) {
    const p = prev?.byName[c.name];
    if (p && dtSec > 0) {
      const ds = Math.max(0, c.bytes_sent - p.sent);
      const dr = Math.max(0, c.bytes_recv - p.recv);
      rates[c.name] = { sentRate: ds / dtSec, recvRate: dr / dtSec };
    } else {
      rates[c.name] = { sentRate: 0, recvRate: 0 };
    }
  }

  prevRef.current = {
    sampledAt,
    byName: Object.fromEntries(
      network.io_counters.map((c) => [c.name, { sent: c.bytes_sent, recv: c.bytes_recv }]),
    ),
  };

  return rates;
}

export function NetworkPanel({ network, sampledAt }: NetworkPanelProps) {
  const rates = useNetRates(network, sampledAt);

  // Сначала «up», потом «down»; loopback — в конец.
  const sorted = [...network.interfaces].sort((a, b) => {
    const aUp = a.flags.includes('up') || a.flags.includes('running');
    const bUp = b.flags.includes('up') || b.flags.includes('running');
    if (aUp !== bUp) return aUp ? -1 : 1;
    const aLo = a.name === 'lo' || a.name.startsWith('lo');
    const bLo = b.name === 'lo' || b.name.startsWith('lo');
    if (aLo !== bLo) return aLo ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  return (
    <Card className="flex flex-col gap-3">
      <PanelTitle
        title="Network"
        subtitle={`// ${network.interfaces.length} iface · ${formatCount(network.connections_count, true)} conn`}
      />

      <div className="grid grid-cols-2 gap-3">
        <StatField
          label="connections"
          value={formatCount(network.connections_count, true)}
          mono
        />
        <StatField label="interfaces" value={network.interfaces.length} mono />
      </div>

      <ul className="divide-y divide-border-subtle">
        {sorted.map((iface) => {
          const isUp = iface.flags.includes('up') || iface.flags.includes('running');
          const counter = network.io_counters.find((c) => c.name === iface.name);
          const rate = rates[iface.name];
          const ipv4 = iface.addresses.find((a) => a.family === 'ipv4');
          return (
            <li key={iface.name} className="py-2.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex min-w-0 items-baseline gap-2">
                  <span className="truncate font-mono text-xs text-fg-primary">
                    {iface.name}
                  </span>
                  <Chip tone={isUp ? 'success' : 'neutral'} mono>
                    {isUp ? 'UP' : 'DOWN'}
                  </Chip>
                  {ipv4 ? (
                    <span className="truncate font-mono text-[10px] text-fg-muted">
                      {ipv4.addr}
                    </span>
                  ) : null}
                </div>
                {rate ? (
                  <div className="flex items-baseline gap-3 font-mono text-[10px] tabular-nums text-fg-muted">
                    <span>↓ {formatBytesPerSecond(rate.recvRate)}</span>
                    <span>↑ {formatBytesPerSecond(rate.sentRate)}</span>
                  </div>
                ) : null}
              </div>
              {counter ? (
                <div className="mt-1 flex items-baseline gap-3 font-mono text-[10px] text-fg-muted">
                  <span>recv {formatBytes(counter.bytes_recv)}</span>
                  <span>sent {formatBytes(counter.bytes_sent)}</span>
                  {counter.err_in + counter.err_out > 0 ? (
                    <span className="text-state-warning">
                      errors {counter.err_in + counter.err_out}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
