import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { taskKeys } from "@/lib/query-keys";
import type { CreateTaskRequest, TaskDetail } from "@features/tasks/types/task.types";

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskRequest) => apiClient.post<TaskDetail>("/api/tasks", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}
