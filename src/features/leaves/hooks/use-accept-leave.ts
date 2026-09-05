import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { leaveKeys } from "@/lib/query-keys";
import type { LeaveRequest } from "@features/leaves/types/leave.types";

export function useAcceptLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.patch<LeaveRequest>(`/api/leaves/${id}/accept`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leaveKeys.lists() }),
  });
}
