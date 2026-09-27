import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { clientKeys } from "@/lib/query-keys";
import type { ClientListItem, UpdateClientRequest } from "@features/clients/types/client.types";

export function useUpdateClient(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateClientRequest) => apiClient.patch<ClientListItem>(`/api/clients/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(id) });
    },
  });
}
