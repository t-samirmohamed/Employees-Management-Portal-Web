import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { AuthResponse, SignupRequest } from "@features/auth/types/auth.types";

export function useSignup() {
  return useMutation({
    mutationFn: (input: SignupRequest) =>
      apiClient.post<AuthResponse>("/api/auth/signup", input, { auth: false }),
  });
}
