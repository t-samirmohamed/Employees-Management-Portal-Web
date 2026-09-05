import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { notificationKeys } from "@/lib/query-keys";
import type { Notification } from "@features/notifications/types/notification.types";

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: () => apiClient.get<Notification[]>("/api/notifications"),
    refetchInterval: 30_000,
  });
}
