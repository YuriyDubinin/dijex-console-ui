import { FadeIn } from '@shared/ui';
import { useSystemQuery } from '@entities/system';
import { CoreError } from '../sections/CoreError';
import { CoreSkeleton } from '../sections/CoreSkeleton';
import { ContainersPanel } from '../sections/ContainersPanel';
import { CpuPanel } from '../sections/CpuPanel';
import { DatabasePanel } from '../sections/DatabasePanel';
import { DisksPanel } from '../sections/DisksPanel';
import { ErrorsBanner } from '../sections/ErrorsBanner';
import { KpiGauges } from '../sections/KpiGauges';
import { MemoryPanel } from '../sections/MemoryPanel';
import { NetworkPanel } from '../sections/NetworkPanel';
import { ProcessPanel } from '../sections/ProcessPanel';
import { ServicesPanel } from '../sections/ServicesPanel';
import { SummaryStrip } from '../sections/SummaryStrip';

const POLL_INTERVAL_MS = 3000;

/**
 * Вкладка Main: дашборд состояния ЛОКАЛЬНОЙ машины (на которой работает API).
 * На будущее: для удалённых серверов будут аналогичные «Main»-дашборды с тем же
 * набором панелей, но другим источником данных. Эти компоненты — «Core/local».
 */
export function MainTab() {
  const { data, error, isLoading, isFetching, refetch } = useSystemQuery();

  if (!data && isLoading) {
    return <CoreSkeleton />;
  }
  if (!data) {
    return <CoreError error={error} onRetry={() => refetch()} />;
  }

  const sampledAt = data.collected_at;

  return (
    <FadeIn distance={4}>
      <div className="space-y-4">
        <SummaryStrip data={data} fetching={isFetching} pollIntervalMs={POLL_INTERVAL_MS} />

        <KpiGauges data={data} sampledAt={sampledAt} />

        <div className="grid gap-4 lg:grid-cols-2">
          <CpuPanel cpu={data.cpu} sampledAt={sampledAt} />
          <MemoryPanel memory={data.memory} sampledAt={sampledAt} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <DisksPanel disks={data.disks} sampledAt={sampledAt} />
          <NetworkPanel network={data.network} sampledAt={sampledAt} />
        </div>

        <ContainersPanel />

        <ServicesPanel />

        <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
          <DatabasePanel database={data.database} />
          <ProcessPanel process={data.process} />
        </div>

        {data.errors?.length ? <ErrorsBanner errors={data.errors} /> : null}
      </div>
    </FadeIn>
  );
}
