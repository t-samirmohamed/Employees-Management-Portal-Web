import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { statisticsKeys } from "@/lib/query-keys";
import type { EmployeeMonthlyActivity } from "@features/statistics/types/statistics.types";

export function useEmployeeMonthlyActivity(id: number, year: number, month: number) {
  return useQuery({
    queryKey: statisticsKeys.employeeMonthly(id, year, month),
    queryFn: () =>
      apiClient.get<EmployeeMonthlyActivity>(
        `/api/statistics/employees/${id}/monthly?year=${year}&month=${month}`
      ),
    enabled: Number.isFinite(id),
    retry: false,
  });
}
