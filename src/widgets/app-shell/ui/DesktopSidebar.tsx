import { Kbd } from '@shared/ui';
import { cn } from '@shared/lib';
import { BrandMark } from './BrandMark';
import { Navigation } from './Navigation';
import { UserBlock } from './UserBlock';

export type DesktopSidebarProps = {
  onLogoutClick: () => void;
  className?: string;
};

export function DesktopSidebar({ onLogoutClick, className }: DesktopSidebarProps) {
  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        'fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col border-r border-border-subtle bg-bg-1 px-4 py-4 md:flex',
        className,
      )}
    >
      <div className="pb-3">
        <BrandMark />
      </div>
      <div className="border-t border-border-subtle" aria-hidden />
      <div className="mt-4">
        <Navigation layoutIdPrefix="desktop" />
      </div>
      <div className="mt-auto">
        <div
          className="mb-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-fg-muted"
          aria-hidden
        >
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
          <span className="ml-1 normal-case tracking-normal">Toggle nav</span>
        </div>
        <UserBlock onLogoutClick={onLogoutClick} />
      </div>
    </aside>
  );
}
