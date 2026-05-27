/** Контракт API подключений к Docker Registry. */

export const REGISTRY_TYPES = [
  'DOCKERHUB',
  'GHCR',
  'GITLAB',
  'HARBOR',
  'ECR',
  'GENERIC',
] as const;

export type RegistryType = (typeof REGISTRY_TYPES)[number];

export type Registry = {
  id: string;
  name: string;
  type: RegistryType;
  url: string;
  username?: string;
  email?: string;
  namespace?: string;
  is_default: boolean;
  is_active: boolean;
  insecure: boolean;
  /** Сохранён ли пароль (наружу сам пароль не возвращается). */
  has_credentials: boolean;
  last_status?: string;
  last_checked_at?: string;
  created_at: string;
  updated_at?: string;
};

export type RegistryPagination = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type RegistryListResponse = {
  items: Registry[];
  pagination: RegistryPagination;
};

export type RegistrySortBy = 'created_at' | 'updated_at' | 'name' | 'type';
export type SortOrder = 'asc' | 'desc';

export type RegistryListParams = {
  page?: number;
  page_size?: number;
  type?: RegistryType;
  is_active?: boolean;
  is_default?: boolean;
  search?: string;
  sort_by?: RegistrySortBy;
  order?: SortOrder;
};

export type CreateRegistryInput = {
  name: string;
  type: RegistryType;
  url: string;
  username?: string;
  password?: string;
  email?: string;
  namespace?: string;
  is_default?: boolean;
  insecure?: boolean;
};

export type UpdateRegistryInput = {
  id: string;
  name: string;
  type: RegistryType;
  url: string;
  /** Не слать ключ → пароль не меняется; "" → очистить; "x" → заменить. */
  username?: string;
  password?: string;
  email?: string;
  namespace?: string;
  is_default?: boolean;
  is_active?: boolean;
  insecure?: boolean;
};

export type DeleteRegistryResponse = {
  id: string;
  status: 'DELETED';
  deleted_at: string;
};
