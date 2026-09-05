import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { clientKeys } from "@/lib/query-keys";
import type { ClientListItem } from "@features/clients/types/client.types";

export function useClients() {
  return useQuery({
    queryKey: clientKeys.lists(),
    queryFn: () => apiClient.get<ClientListItem[]>("/api/clients"),
  });
}
