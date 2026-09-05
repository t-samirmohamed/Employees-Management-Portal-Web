import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { userKeys } from "@/lib/query-keys";
import type { UserListItem } from "@features/users/types/user.types";

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => apiClient.get<UserListItem[]>("/api/users"),
  });
}
