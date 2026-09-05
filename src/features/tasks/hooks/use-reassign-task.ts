import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { taskKeys } from "@/lib/query-keys";
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
    },
  });
}
