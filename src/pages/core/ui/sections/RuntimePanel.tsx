import { Card, Chip, Sparkline, StatField } from '@shared/ui';
import {
  formatBytes,
  formatCount,
  formatNs,
  shortSha,
  type SystemGoRuntime,
} from '@entities/system';
import { PanelTitle } from './PanelTitle';

export type RuntimePanelProps = {
  runtime: SystemGoRuntime;
  sampledAt: string;
};

export function RuntimePanel({ runtime, sampledAt }: RuntimePanelProps) {
  const meanPauseNs = runtime.gc.num_gc > 0 ? runtime.gc.total_pause_ns / runtime.gc.num_gc : 0;
  const liveObjects = Math.max(0, runtime.memory.mallocs - runtime.memory.frees);

  return (
    <Card className="flex flex-col gap-4">
      <PanelTitle
        title="Go runtime"
        subtitle={'// goroutines · heap · gc'}
        actions={
          <span className="font-mono text-[10px] uppercase tracking-wider text-fg-muted">
            {runtime.version}
          </span>
        }
      />

      <div className="grid grid-cols-3 gap-3">
        <StatField label="GOMAXPROCS" value={runtime.gomaxprocs} mono />
        <StatField label="goroutines" value={formatCount(runtime.num_goroutines)} mono />
        <StatField label="cgo calls" value={formatCount(runtime.num_cgo_calls)} mono />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-fg-muted">
            goroutines (trend)
          </span>
          <span className="font-mono text-xs tabular-nums text-fg-primary">
            {runtime.num_goroutines}
          </span>
        </div>
        <div className="mt-2">
          <Sparkline value={runtime.num_goroutines} sampledAt={sampledAt} height={32} />
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-fg-muted">
            heap alloc
          </span>
          <span className="font-mono text-xs tabular-nums text-fg-primary">
            {formatBytes(runtime.memory.heap_alloc_bytes)}
          </span>
        </div>
        <div className="mt-2">
          <Sparkline
            value={runtime.memory.heap_alloc_bytes}
            sampledAt={sampledAt}
            height={32}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border-subtle pt-3">
        <StatField label="heap inuse" value={formatBytes(runtime.memory.heap_inuse_bytes)} mono />
        <StatField label="heap sys" value={formatBytes(runtime.memory.heap_sys_bytes)} mono />
        <StatField label="stack" value={formatBytes(runtime.memory.stack_inuse_bytes)} mono />
        <StatField label="next gc" value={formatBytes(runtime.memory.next_gc_bytes)} mono />
        <StatField label="objects" value={formatCount(liveObjects, true)} mono />
        <StatField label="total alloc" value={formatBytes(runtime.memory.total_alloc_bytes)} mono />
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-border-subtle pt-3">
        <StatField label="num gc" value={formatCount(runtime.gc.num_gc)} mono />
        <StatField label="mean pause" value={formatNs(meanPauseNs)} mono />
        <StatField
          label="gc cpu%"
          value={(runtime.gc.cpu_fraction * 100).toFixed(2) + '%'}
          mono
        />
      </div>

      <div className="border-t border-border-subtle pt-3">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-fg-muted">
            build
          </span>
          {runtime.build_info.vcs_modified ? (
            <Chip tone="warning" mono>
              DIRTY
            </Chip>
          ) : null}
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[11px] text-fg-secondary">
          <span>{runtime.build_info.main_version}</span>
          <span className="text-fg-muted">{shortSha(runtime.build_info.vcs_revision)}</span>
        </div>
      </div>
    </Card>
  );
}
