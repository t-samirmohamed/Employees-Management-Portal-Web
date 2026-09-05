import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { clientKeys } from "@/lib/query-keys";
import type { ClientVisitStats } from "@features/clients/types/client.types";

export function useClientVisitStats(id: number, range: string) {
  return useQuery({
    queryKey: clientKeys.visitStats(id, range),
    queryFn: () =>
      apiClient.get<ClientVisitStats>(`/api/clients/${id}/visit-stats?range=${range}`),
    enabled: Number.isFinite(id),
  });
}
