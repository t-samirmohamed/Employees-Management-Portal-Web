import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { statisticsKeys } from "@/lib/query-keys";
import type { EmployeeStatistics } from "@features/statistics/types/statistics.types";

export function useEmployeeStatistics() {
  return useQuery({
    queryKey: statisticsKeys.employees,
    queryFn: () => apiClient.get<EmployeeStatistics>("/api/statistics/employees"),
  });
}
