import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useLogout() {
  return useMutation({
    mutationFn: () => apiClient.post<void>("/api/auth/logout"),
  });
}
