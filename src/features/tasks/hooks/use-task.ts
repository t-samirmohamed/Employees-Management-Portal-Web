import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { taskKeys } from "@/lib/query-keys";
import type { TaskDetailResponse } from "@features/tasks/types/task.types";

export function useTask(id: number) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => apiClient.get<TaskDetailResponse>(`/api/tasks/${id}`),
    enabled: Number.isFinite(id),
  });
}
