import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { employeeKeys } from "@/lib/query-keys";
import type { EmployeeFiltersInput } from "@features/employees/schemas/employee-filters.schema";
import type { EmployeeListItem } from "@features/employees/types/employee.types";

function buildQueryString(filters: EmployeeFiltersInput): string {
  const params = new URLSearchParams();
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.status) params.set("status", filters.status);
  if (filters.attendanceStatus) params.set("attendanceStatus", filters.attendanceStatus);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useEmployees(filters: EmployeeFiltersInput) {
  return useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: () => apiClient.get<EmployeeListItem[]>(`/api/employees${buildQueryString(filters)}`),
  });
}
