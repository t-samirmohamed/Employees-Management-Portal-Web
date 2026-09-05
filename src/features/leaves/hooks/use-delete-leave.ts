import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { leaveKeys } from "@/lib/query-keys";

export function useDeleteLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.delete<void>(`/api/leaves/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leaveKeys.lists() }),
  });
}
