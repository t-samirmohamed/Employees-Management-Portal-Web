import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { clientKeys } from "@/lib/query-keys";
import type { ClientDetail, CreateClientRequest } from "@features/clients/types/client.types";

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateClientRequest) => apiClient.post<ClientDetail>("/api/clients", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}
