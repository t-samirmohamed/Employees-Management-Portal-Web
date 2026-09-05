import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { taskKeys } from "@/lib/query-keys";
import type { TaskComment } from "@features/tasks/types/task.types";

export function useUpdateComment(taskId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, text }: { commentId: number; text: string }) =>
      apiClient.patch<TaskComment>(`/api/tasks/${taskId}/comments/${commentId}`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    },
  });
}
