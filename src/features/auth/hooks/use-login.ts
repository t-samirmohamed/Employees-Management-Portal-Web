import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { AuthResponse, LoginRequest } from "@features/auth/types/auth.types";

export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginRequest) =>
      apiClient.post<AuthResponse>("/api/auth/login", input, { auth: false }),
  });
}
