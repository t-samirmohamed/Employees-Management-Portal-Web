import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { leaveKeys } from "@/lib/query-keys";
import type { CreateLeaveRequest, LeaveRequest } from "@features/leaves/types/leave.types";

export function useCreateLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLeaveRequest) => apiClient.post<LeaveRequest>("/api/leaves", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leaveKeys.lists() }),
  });
}
