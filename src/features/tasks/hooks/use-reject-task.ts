import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { taskKeys } from "@/lib/query-keys";
import type { TaskDetail, TaskDetailResponse } from "@features/tasks/types/task.types";

export function useRejectTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      apiClient.patch<TaskDetail>(`/api/tasks/${id}/reject`, { reason }),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(taskKeys.detail(id), (prev: TaskDetailResponse | undefined) =>
        prev ? { ...prev, task: data } : prev
      );
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}
