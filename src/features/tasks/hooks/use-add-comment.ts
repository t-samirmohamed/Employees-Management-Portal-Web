import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { taskKeys } from "@/lib/query-keys";
import type { TaskComment } from "@features/tasks/types/task.types";

export function useAddComment(taskId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) =>
      apiClient.post<TaskComment>(`/api/tasks/${taskId}/comments`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    },
  });
}
