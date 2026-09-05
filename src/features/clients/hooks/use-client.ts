import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { clientKeys } from "@/lib/query-keys";
import type { ClientDetail } from "@features/clients/types/client.types";

export function useClient(id: number) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => apiClient.get<ClientDetail>(`/api/clients/${id}`),
    enabled: Number.isFinite(id),
  });
}
