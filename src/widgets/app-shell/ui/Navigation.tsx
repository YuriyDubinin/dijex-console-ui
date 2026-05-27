import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tooltip } from '@shared/ui';
import { cn } from '@shared/lib';
import { NAV_ITEMS, type NavItem } from '../model/nav';

export type NavigationProps = {
  /** Колбэк после клика по пункту — например, чтобы закрыть mobile drawer. */
  onItemSelect?: () => void;
  /** Уникальный для каждого инстанса (desktop / drawer) layoutId-prefix,
   *  чтобы две одновременно смонтированные навигации не «перетекали» друг к другу. */
  layoutIdPrefix?: string;
  /** Свёрнутый режим — только иконки по центру + tooltip с названием. */
  collapsed?: boolean;
  className?: string;
};

function Item({
  item,
  onSelect,
  layoutIdPrefix,
  collapsed,
}: {
  item: NavItem;
  onSelect?: () => void;
  layoutIdPrefix: string;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  const link = (
    <NavLink
      to={item.to}
      onClick={onSelect}
      aria-label={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'relative flex items-center rounded-md py-2 text-sm transition-colors duration-150 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          collapsed ? 'justify-center px-0' : 'gap-3 px-3',
          isActive
            ? 'bg-bg-2 text-fg-primary'
            : 'text-fg-secondary hover:bg-bg-2 hover:text-fg-primary',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <motion.span
              layoutId={`${layoutIdPrefix}-nav-active`}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              aria-hidden
              className="absolute inset-y-1 left-0 w-0.5 rounded-sm bg-accent"
            />
          ) : null}
          <Icon size={16} aria-hidden className={cn(isActive ? 'text-accent' : 'text-current')} />
          {collapsed ? null : <span>{item.label}</span>}
        </>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip content={item.label} side="right">
        {link}
      </Tooltip>
    );
  }
  return link;
}

export function Navigation({
  onItemSelect,
  layoutIdPrefix = 'nav',
  collapsed = false,
  className,
}: NavigationProps) {
  return (
    <nav
      role="navigation"
      aria-label="Основная навигация"
      className={cn('flex flex-col gap-1', className)}
    >
      {NAV_ITEMS.map((item) => (
        <Item
          key={item.to}
          item={item}
          onSelect={onItemSelect}
          layoutIdPrefix={layoutIdPrefix}
          collapsed={collapsed}
        />
      ))}
    </nav>
  );
}
