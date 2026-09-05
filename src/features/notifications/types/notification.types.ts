export type NotificationType =
  | "LeaveRequestSubmitted"
  | "LeaveRequestAccepted"
  | "LeaveRequestRejected"
  | "LeaveRequestDelayRequested"
  | "TaskAssigned"
  | "VisitAssigned";

export type Notification = {
  id: number;
  type: NotificationType;
  referenceId: number;
  isRead: boolean;
  createdAt: string;
};
