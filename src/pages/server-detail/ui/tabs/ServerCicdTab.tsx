import { useMemo, useState } from 'react';
import { Boxes, ChevronDown, Container as ContainerIcon } from 'lucide-react';
import {
  Card,
  Chip,
  DataView,
  FadeIn,
  Label,
  ViewToggle,
  type DataColumn,
  type ViewMode,
} from '@shared/ui';
import { cn, usePersistentState } from '@shared/lib';
import { formatRelative } from '@entities/system';
import {
  useRemoteContainersQuery,
  type ContainerInfo,
} from '@entities/containers';
import { usePingPolling, type Server } from '@entities/server';
import { HostImagesDialog, LiveIndicator } from '@widgets/system-snapshot';
import { ContainerCard, PortChip, StateIcon } from './ContainerCard';

export type ServerCicdTabProps = {
  server: Server;
};

const POLL_INTERVAL_MS = 3000;

// ---------- Маленькая плашка live-индикатора («поллинг сервера 3с») ----------

function CicdLivePill({
  status,
  active,
  fetching,
}: {
  status?: string;
  active: boolean;
  fetching: boolean;
}) {
  const ok = active && status?.toUpperCase() === 'OK';
  const tone = ok ? 'text-state-success' : active ? 'text-state-warning' : 'text-state-error';
  const label = ok ? 'ONLINE' : active ? (status ?? 'CHECKING') : 'OFFLINE';
  return (
    <section
      aria-label="Server liveness"
      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-md border border-border-subtle bg-bg-1 px-3 py-2"
    >
      <span className="inline-flex items-center gap-2">
        <span className={cn('relative inline-flex h-2 w-2 shrink-0', tone)}>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current shadow-[0_0_6px_currentColor]" />
        </span>
        <span className={cn('font-mono text-[11px] font-semibold uppercase tracking-wider', tone)}>
          {label}
        </span>
        <span className="text-fg-muted/50">·</span>
        <span className="font-mono text-xs text-fg-secondary">ping every 3s</span>
      </span>
      <LiveIndicator fetching={fetching} intervalMs={POLL_INTERVAL_MS} />
    </section>
  );
}

// ---------- Кнопка-«селект» Images ----------

/**
 * Выглядит как невыбранный селект (бордер + chevron справа). Лейбл «Images»
 * сверху. По клику открывается модалка `HostImagesDialog` со списком
 * Docker-образов с локальной машины (GET /api/system/images/list).
 */
function ImagesSelect({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex max-w-md flex-col gap-1.5">
      <Label htmlFor="server-cicd-images-select">Images</Label>
      <button
        id="server-cicd-images-select"
        type="button"
        onClick={onOpen}
        className={cn(
          'inline-flex w-full items-center justify-between gap-2 rounded-md border bg-bg-1 px-3 py-2 text-sm',
          'transition-colors duration-150 ease-out',
          'border-border-subtle hover:border-border-strong',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg-0',
          'text-fg-muted hover:text-fg-secondary',
        )}
      >
        <span className="inline-flex items-center gap-2">
          <Boxes size={14} aria-hidden />
          <span className="font-mono text-xs">Browse host images…</span>
        </span>
        <ChevronDown size={14} aria-hidden />
      </button>
    </div>
  );
}

// ---------- DataView таблицы/карточек контейнеров ----------

/** Сортировка: running → restarting → paused → created → exited → dead. */
function statePriority(s: string): number {
  switch (s) {
    case 'running':
      return 0;
    case 'restarting':
      return 1;
    case 'paused':
      return 2;
    case 'created':
      return 3;
    case 'exited':
      return 4;
    case 'dead':
      return 5;
    default:
      return 6;
  }
}

const STATE_TONE_CHIP: Record<string, 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'accent'> = {
  running: 'success',
  exited: 'neutral',
  paused: 'warning',
  restarting: 'info',
  created: 'info',
  dead: 'error',
};

function containerColumns(): DataColumn<ContainerInfo>[] {
  return [
    {
      key: 'name',
      header: 'Name',
      cell: (c) => (
        <span className="inline-flex flex-col">
          <span className="font-mono text-sm text-fg-primary">{c.name}</span>
          <span className="font-mono text-[10px] text-fg-muted">{c.short_id}</span>
        </span>
      ),
    },
    {
      key: 'state',
      header: 'State',
      cell: (c) => (
        <span className="inline-flex flex-wrap items-center gap-1">
          <Chip tone={STATE_TONE_CHIP[c.state] ?? 'neutral'} mono>
            <span className="inline-flex items-center gap-1">
              <StateIcon state={c.state} restarting={c.restarting} />
              {c.state}
            </span>
          </Chip>
          {c.health && c.health !== '' ? (
            <Chip
              tone={
                c.health === 'healthy' ? 'success' : c.health === 'unhealthy' ? 'error' : 'info'
              }
              mono
            >
              {c.health}
            </Chip>
          ) : null}
          {c.restart_count > 0 ? (
            <Chip tone="warning" mono>
              ↻ {c.restart_count}
            </Chip>
          ) : null}
          {c.oom_killed ? (
            <Chip tone="error" mono>
              OOM
            </Chip>
          ) : null}
        </span>
      ),
    },
    {
      key: 'image',
      header: 'Image',
      cell: (c) => (
        <span className="inline-flex max-w-[260px] flex-col">
          <span className="truncate font-mono text-xs text-fg-secondary" title={c.image}>
            {c.image}
          </span>
          {c.image_id ? (
            <span className="font-mono text-[10px] text-fg-muted" title={c.image_id}>
              {c.image_id.replace(/^sha256:/, '').slice(0, 12)}
            </span>
          ) : null}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (c) => (
        <span className="font-mono text-[11px] text-fg-muted" title={c.status}>
          {c.status || '—'}
        </span>
      ),
    },
    {
      key: 'ports',
      header: 'Ports',
      cell: (c) => {
        const ports = (c.ports ?? []).filter((p) => p.private_port > 0);
        if (ports.length === 0) {
          return <span className="font-mono text-[10px] text-fg-muted">—</span>;
        }
        return (
          <span className="inline-flex max-w-[220px] flex-wrap gap-1">
            {ports.slice(0, 3).map((p, i) => (
              <PortChip key={`${p.private_port}-${p.type}-${i}`} port={p} />
            ))}
            {ports.length > 3 ? (
              <span className="font-mono text-[10px] text-fg-muted">+{ports.length - 3}</span>
            ) : null}
          </span>
        );
      },
    },
    {
      key: 'created',
      header: 'Created',
      align: 'right',
      cell: (c) => (
        <span className="font-mono text-[11px] text-fg-muted">{formatRelative(c.created_at)}</span>
      ),
    },
  ];
}

// ---------- Корневая вкладка ----------

export function ServerCicdTab({ server }: ServerCicdTabProps) {
  // Фоновый пинг сервера 3с — оставляем индикатор живости.
  const pingQ = usePingPolling(server.id);
  // Контейнеры этого сервера (через SSH).
  const containersQ = useRemoteContainersQuery(server.id);

  const [imagesOpen, setImagesOpen] = useState(false);
  // Выбор «таблица / карточки» переживает перезагрузку.
  const [view, setView] = usePersistentState<ViewMode>(
    'page.server-cicd.containers.view',
    'table',
    (raw): raw is ViewMode => raw === 'table' || raw === 'cards',
  );

  const data = containersQ.data;
  const sorted = useMemo(() => {
    const list = data?.containers ?? [];
    return [...list].sort((a, b) => {
      const ps = statePriority(a.state) - statePriority(b.state);
      if (ps !== 0) return ps;
      return a.name.localeCompare(b.name);
    });
  }, [data]);

  const columns = useMemo(() => containerColumns(), []);

  return (
    <FadeIn distance={4}>
      <div className="space-y-4">
        <CicdLivePill
          status={pingQ.data?.status ?? server.last_status}
          active={server.is_active}
          fetching={pingQ.isFetching}
        />

        <ImagesSelect onOpen={() => setImagesOpen(true)} />
        <HostImagesDialog open={imagesOpen} onOpenChange={setImagesOpen} />

        {/* Контейнеры: тулбар + DataView (таблица / карточки) */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <Label>Containers</Label>
          <ViewToggle value={view} onChange={setView} />
        </div>

        {data && !data.available ? (
          <Card>
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <ContainerIcon size={20} aria-hidden className="text-fg-muted" />
              <p className="font-mono text-xs text-fg-muted">Docker containers unavailable</p>
              {data.reason ? (
                <p className="max-w-md break-words font-mono text-[10px] leading-relaxed text-fg-muted/80">
                  {data.reason}
                </p>
              ) : null}
            </div>
          </Card>
        ) : (
          <DataView<ContainerInfo>
            items={sorted}
            columns={columns}
            renderCard={(c) => <ContainerCard container={c} />}
            getRowKey={(c) => c.id}
            view={view}
            isLoading={containersQ.isLoading || (containersQ.isFetching && sorted.length === 0)}
            empty={
              <Card>
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <ContainerIcon size={20} aria-hidden className="text-fg-muted" />
                  <p className="font-mono text-xs text-fg-muted">No containers on this host</p>
                </div>
              </Card>
            }
          />
        )}
      </div>
    </FadeIn>
  );
}
