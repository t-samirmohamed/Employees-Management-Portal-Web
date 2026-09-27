import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { clientKeys } from "@/lib/query-keys";
import type { CreateLocationRequest, Location } from "@features/clients/types/client.types";

export function useAddLocation(clientId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLocationRequest) =>
      apiClient.post<Location>(`/api/clients/${clientId}/locations`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(clientId) });
    },
  });
}
