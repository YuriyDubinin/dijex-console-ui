import { Container as ContainerIcon, Cpu, Server, Users, type LucideIcon } from 'lucide-react';

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { to: '/core', label: 'Core', icon: Cpu },
  { to: '/servers', label: 'Servers', icon: Server },
  { to: '/containers', label: 'Containers', icon: ContainerIcon },
  { to: '/clients', label: 'Clients', icon: Users },
];
