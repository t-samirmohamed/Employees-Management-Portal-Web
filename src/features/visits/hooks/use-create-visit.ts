import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { visitKeys } from "@/lib/query-keys";
import type { CreateVisitRequest, VisitDetail } from "@features/visits/types/visit.types";

export function useCreateVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVisitRequest) => apiClient.post<VisitDetail>("/api/visits", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: visitKeys.lists() });
    },
  });
}
