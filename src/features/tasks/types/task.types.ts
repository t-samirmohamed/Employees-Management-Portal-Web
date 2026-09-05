import type { TaskItemStatus } from "@shared/types/enums";

export type TaskListItem = {
  id: number;
  name: string;
  dueDateTime: string;
  assigneeId: number;
  relatedVisitId: number | null;
  status: TaskItemStatus;
  attendanceRequired: boolean;
};

export type TaskDetail = TaskListItem & {
  notes: string | null;
  rejectionReason: string | null;
  createdAt: string;
};

export type TaskComment = {
  id: number;
  authorEmployeeId: number;
  text: string;
  createdAt: string;
  updatedAt: string | null;
};

export type TaskDetailResponse = {
  task: TaskDetail;
  comments: TaskComment[];
};

export type CreateTaskRequest = {
  name: string;
  dueDateTime: string;
  assigneeId: number;
  notes?: string;
  attendanceRequired: boolean;
};

export type ReassignTaskRequest = { newAssigneeId: number };
export type RejectTaskRequest = { reason: string };
export type AddCommentRequest = { text: string };
export type UpdateCommentRequest = { text: string };
