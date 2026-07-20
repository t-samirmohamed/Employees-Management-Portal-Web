import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { employeeKeys, statisticsKeys } from "@/lib/query-keys";
import type { EmployeeDetail } from "@features/employees/types/employee.types";

export function useActivateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.patch<EmployeeDetail>(`/api/employees/${id}/activate`),
    onSuccess: (data, id) => {
      queryClient.setQueryData(employeeKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statisticsKeys.employees });
    },
  });
}
