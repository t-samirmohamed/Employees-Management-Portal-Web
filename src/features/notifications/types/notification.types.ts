export type NotificationType = "LeaveRequestSubmitted";

export type Notification = {
  id: number;
  type: NotificationType;
  referenceId: number;
  isRead: boolean;
  createdAt: string;
};
