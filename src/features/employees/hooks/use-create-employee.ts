import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { employeeKeys, statisticsKeys } from "@/lib/query-keys";
import type { CreateEmployeeRequest, EmployeeDetail } from "@features/employees/types/employee.types";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEmployeeRequest) =>
      apiClient.post<EmployeeDetail>("/api/employees", input),
    onSuccess: () => {
      // A new employee changes both the list and the statistics dashboard —
      // both are derived from the same Employees table.
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statisticsKeys.employees });
    },
  });
}
