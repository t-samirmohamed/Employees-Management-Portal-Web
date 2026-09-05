import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { employeeKeys, taskKeys } from "@/lib/query-keys";
import type { TaskDetail, TaskDetailResponse } from "@features/tasks/types/task.types";

export function useReassignTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newAssigneeId }: { id: number; newAssigneeId: number }) =>
      apiClient.patch<TaskDetail>(`/api/tasks/${id}`, { newAssigneeId }),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(taskKeys.detail(id), (prev: TaskDetailResponse | undefined) =>
        prev ? { ...prev, task: data } : prev
      );
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      // Reassigning an in-progress AttendanceRequired task recalculates the
      // *previous* assignee's AttendanceStatus server-side — keep the employees
      // list in sync.
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
}
