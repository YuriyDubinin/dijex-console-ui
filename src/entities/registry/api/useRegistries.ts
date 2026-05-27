import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import type {
  CreateRegistryInput,
  DeleteRegistryResponse,
  Registry,
  RegistryListParams,
  RegistryListResponse,
  UpdateRegistryInput,
} from '../model';
import {
  createRegistry,
  deleteRegistry,
  listRegistries,
  updateRegistry,
} from './registriesApi';

export const REGISTRIES_QUERY_KEY = ['registries'] as const;

export function useRegistriesQuery(
  params: RegistryListParams,
): UseQueryResult<RegistryListResponse, Error> {
  return useQuery<RegistryListResponse, Error>({
    queryKey: [...REGISTRIES_QUERY_KEY, 'list', params],
    queryFn: ({ signal }) => listRegistries(params, signal),
    staleTime: 10_000,
    placeholderData: (prev) => prev,
  });
}

export function useCreateRegistry(): UseMutationResult<Registry, Error, CreateRegistryInput> {
  const qc = useQueryClient();
  return useMutation<Registry, Error, CreateRegistryInput>({
    mutationFn: createRegistry,
    meta: { silent: true }, // ошибки показываем в форме (по code/details)
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: REGISTRIES_QUERY_KEY });
    },
  });
}

export function useUpdateRegistry(): UseMutationResult<Registry, Error, UpdateRegistryInput> {
  const qc = useQueryClient();
  return useMutation<Registry, Error, UpdateRegistryInput>({
    mutationFn: updateRegistry,
    meta: { silent: true },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: REGISTRIES_QUERY_KEY });
    },
  });
}

export function useDeleteRegistry(): UseMutationResult<DeleteRegistryResponse, Error, string> {
  const qc = useQueryClient();
  return useMutation<DeleteRegistryResponse, Error, string>({
    mutationFn: deleteRegistry,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: REGISTRIES_QUERY_KEY });
    },
  });
}
