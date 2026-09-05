import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { visitKeys } from "@/lib/query-keys";
import type { VisitDetail } from "@features/visits/types/visit.types";

export function useVisit(id: number) {
  return useQuery({
    queryKey: visitKeys.detail(id),
    queryFn: () => apiClient.get<VisitDetail>(`/api/visits/${id}`),
    enabled: Number.isFinite(id),
  });
}
