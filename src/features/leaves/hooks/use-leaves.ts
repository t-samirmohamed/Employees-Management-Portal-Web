import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { leaveKeys } from "@/lib/query-keys";
import type { LeaveRequest } from "@features/leaves/types/leave.types";

export function useLeaves() {
  return useQuery({
    queryKey: leaveKeys.lists(),
    queryFn: () => apiClient.get<LeaveRequest[]>("/api/leaves"),
  });
}
