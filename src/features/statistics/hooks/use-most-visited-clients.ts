import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { statisticsKeys } from "@/lib/query-keys";
import type { MostVisitedClient } from "@features/statistics/types/statistics.types";

export function useMostVisitedClients(range: string) {
  return useQuery({
    queryKey: statisticsKeys.mostVisitedClients(range),
    queryFn: () =>
      apiClient.get<MostVisitedClient[]>(`/api/statistics/clients/most-visited?range=${range}`),
  });
}
