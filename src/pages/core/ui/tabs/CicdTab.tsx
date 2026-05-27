import { GitBranch } from 'lucide-react';
import { Card, FadeIn } from '@shared/ui';

/**
 * Вкладка CI / CD — пока пустая заглушка.
 */
export function CicdTab() {
  return (
    <FadeIn distance={4}>
      <Card>
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <GitBranch size={20} aria-hidden className="text-fg-muted" />
          <p className="font-mono text-xs text-fg-muted">Nothing here yet.</p>
        </div>
      </Card>
    </FadeIn>
  );
}
