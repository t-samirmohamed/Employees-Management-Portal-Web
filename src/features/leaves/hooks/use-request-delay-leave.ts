import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { leaveKeys } from "@/lib/query-keys";
import type { LeaveRequest } from "@features/leaves/types/leave.types";

export function useRequestDelayLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, targetDate, reason }: { id: number; targetDate: string; reason: string }) =>
      apiClient.patch<LeaveRequest>(`/api/leaves/${id}/request-delay`, { targetDate, reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leaveKeys.lists() }),
  });
}
