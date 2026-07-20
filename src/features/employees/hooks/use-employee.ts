import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { employeeKeys } from "@/lib/query-keys";
import type { EmployeeDetail } from "@features/employees/types/employee.types";

export function useEmployee(id: number) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => apiClient.get<EmployeeDetail>(`/api/employees/${id}`),
    enabled: Number.isFinite(id),
  });
}
