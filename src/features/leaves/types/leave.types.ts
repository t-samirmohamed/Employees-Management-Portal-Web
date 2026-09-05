import type { LeaveRequestStatus } from "@shared/types/enums";

export type LeaveRequest = {
  id: number;
  requesterId: number;
  startDate: string;
  endDate: string;
  status: LeaveRequestStatus;
  approverEmployeeId: number | null;
};

export type CreateLeaveRequest = {
  startDate: string;
  endDate: string;
  reason: string;
};

export type RejectLeaveRequest = {
  reason: string;
};

export type RequestDelayRequest = {
  targetDate: string;
  reason: string;
};
