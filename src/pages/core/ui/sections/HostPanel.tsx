import { Card, Chip, StatField } from '@shared/ui';
import { formatIsoUtc, formatUptime, type SystemHost } from '@entities/system';
import { PanelTitle } from './PanelTitle';

export type HostPanelProps = {
  host: SystemHost;
};

export function HostPanel({ host }: HostPanelProps) {
  const virt = host.virtualization_system
    ? `${host.virtualization_system}${host.virtualization_role ? ' / ' + host.virtualization_role : ''}`
    : null;

  return (
    <Card className="flex flex-col gap-3">
      <PanelTitle
        title="Host"
        subtitle={'// platform · kernel · virt'}
        actions={virt ? <Chip tone="info" mono>{virt}</Chip> : undefined}
      />

      <StatField label="hostname" value={host.hostname || '—'} mono />
      {host.fqdn && host.fqdn !== host.hostname ? (
        <StatField label="fqdn" value={host.fqdn} mono />
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <StatField label="os" value={host.os || '—'} mono />
        <StatField label="arch" value={host.kernel_arch || '—'} mono />
        <StatField label="platform" value={host.platform || '—'} mono />
        <StatField label="version" value={host.platform_version || '—'} mono />
      </div>

      <StatField
        label="kernel"
        value={host.kernel_version || '—'}
        mono
        valueClassName="text-[11px] leading-snug"
      />

      <div className="grid grid-cols-2 gap-3 border-t border-border-subtle pt-3">
        <StatField label="host uptime" value={formatUptime(host.uptime_seconds)} mono />
        <StatField label="timezone" value={host.timezone || '—'} mono />
      </div>

      <StatField
        label="boot time"
        value={formatIsoUtc(host.boot_time)}
        mono
        valueClassName="text-[11px]"
      />
      <StatField
        label="host id"
        value={host.host_id || '—'}
        mono
        valueClassName="text-[11px] break-all"
      />
    </Card>
  );
}
