import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { statisticsKeys } from "@/lib/query-keys";
import type { SupervisorTeamStats } from "@features/statistics/types/statistics.types";

export function useSupervisorTeamStats() {
  return useQuery({
    queryKey: statisticsKeys.supervisors,
    queryFn: () => apiClient.get<SupervisorTeamStats[]>("/api/statistics/supervisors"),
  });
}
