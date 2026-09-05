import type { TaskItemStatus } from "@shared/types/enums";

export type VisitListItem = {
  id: number;
  dateTime: string;
  clientId: number;
  locationId: number;
  assigneeId: number;
  status: TaskItemStatus;
  taskId: number;
};

export type VisitDetail = VisitListItem & {
  createdAt: string;
};

export type CreateVisitRequest = {
  dateTime: string;
  clientId: number;
  locationId: number;
  assigneeId: number;
  name?: string;
  notes?: string;
};
