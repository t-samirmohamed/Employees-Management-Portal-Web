import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { employeeKeys, taskKeys } from "@/lib/query-keys";
import type { TaskDetail, TaskDetailResponse } from "@features/tasks/types/task.types";

export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.patch<TaskDetail>(`/api/tasks/${id}/complete`),
    onSuccess: (data, id) => {
      queryClient.setQueryData(taskKeys.detail(id), (prev: TaskDetailResponse | undefined) =>
        prev ? { ...prev, task: data } : prev
      );
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      // Completing an AttendanceRequired task recalculates the assignee's
      // AttendanceStatus server-side — keep the employees list in sync.
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}
