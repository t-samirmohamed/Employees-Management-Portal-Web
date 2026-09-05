export type ViewMode = "list" | "calendar" | "kanban";

export type ScheduledItem = {
  id: number;
  title: string;
  date: string;
  statusKey: string;
  href: string;
};
