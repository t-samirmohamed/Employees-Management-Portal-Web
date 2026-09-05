"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "@/i18n/navigation";
import { useNotifications } from "@features/notifications/hooks/use-notifications";
import { useMarkNotificationRead } from "@features/notifications/hooks/use-mark-notification-read";
import type { Notification } from "@features/notifications/types/notification.types";

function messageFor(notification: Notification, t: (key: string) => string): string {
  switch (notification.type) {
    case "LeaveRequestSubmitted":
      return t("messages.LeaveRequestSubmitted");
    case "LeaveRequestAccepted":
      return t("messages.LeaveRequestAccepted");
    case "LeaveRequestRejected":
      return t("messages.LeaveRequestRejected");
    case "LeaveRequestDelayRequested":
      return t("messages.LeaveRequestDelayRequested");
    case "TaskAssigned":
      return t("messages.TaskAssigned");
    case "VisitAssigned":
      return t("messages.VisitAssigned");
    default:
      return notification.type;
  }
}

function linkFor(notification: Notification): string {
  switch (notification.type) {
    case "LeaveRequestSubmitted":
      return `/leaves?requestId=${notification.referenceId}`;
    case "LeaveRequestAccepted":
    case "LeaveRequestRejected":
    case "LeaveRequestDelayRequested":
      return `/leaves?myRequestId=${notification.referenceId}`;
    case "TaskAssigned":
      return `/tasks/${notification.referenceId}`;
    case "VisitAssigned":
      return `/visits/${notification.referenceId}`;
    default:
      return "/leaves";
  }
}

export function NotificationBell() {
  const t = useTranslations("notifications");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: notifications } = useNotifications();
  const markRead = useMarkNotificationRead();

  const unreadCount = (notifications ?? []).filter((n) => !n.isRead).length;

  function handleClick(notification: Notification) {
    if (!notification.isRead) markRead.mutate(notification.id);
    setOpen(false);
    router.push(linkFor(notification));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 min-w-4 justify-center px-1 text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        {!notifications || notifications.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">{t("bell.empty")}</p>
        ) : (
          <ul className="flex max-h-80 flex-col divide-y overflow-y-auto">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <button
                  type="button"
                  onClick={() => handleClick(notification)}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-accent ${
                    notification.isRead ? "text-muted-foreground" : "font-medium"
                  }`}
                >
                  <p>{messageFor(notification, t)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
