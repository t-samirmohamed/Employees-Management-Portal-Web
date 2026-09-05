import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { taskKeys } from "@/lib/query-keys";
import type { TaskListItem } from "@features/tasks/types/task.types";

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.list(),
    queryFn: () => apiClient.get<TaskListItem[]>("/api/tasks"),
  });
}
