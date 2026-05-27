import {
  Container as ContainerIcon,
  Cpu,
  Package,
  Server,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { to: '/core', label: 'Core', icon: Cpu },
  { to: '/registry', label: 'Registry', icon: Package },
  { to: '/servers', label: 'Servers', icon: Server },
  { to: '/services', label: 'Services', icon: Workflow },
  { to: '/containers', label: 'Containers', icon: ContainerIcon },
  { to: '/clients', label: 'Clients', icon: Users },
];
