import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { visitKeys } from "@/lib/query-keys";
import type { VisitListItem } from "@features/visits/types/visit.types";

export function useVisits() {
  return useQuery({
    queryKey: visitKeys.list(),
    queryFn: () => apiClient.get<VisitListItem[]>("/api/visits"),
  });
}
