import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { leaveKeys } from "@/lib/query-keys";
import type { CreateLeaveRequest, LeaveRequest } from "@features/leaves/types/leave.types";

export function useUpdateLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CreateLeaveRequest }) =>
      apiClient.patch<LeaveRequest>(`/api/leaves/${id}`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leaveKeys.lists() }),
  });
}
