import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { statisticsKeys } from "@/lib/query-keys";
import type { StatusStats } from "@features/statistics/types/statistics.types";

export function useStatusStats() {
  return useQuery({
    queryKey: statisticsKeys.status,
    queryFn: () => apiClient.get<StatusStats>("/api/statistics/status"),
  });
}
