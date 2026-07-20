import type { AttendanceStatus, EmployeeStatus, Gender } from "@shared/types/enums";

export type EmployeeListItem = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  status: EmployeeStatus;
  attendanceStatus: AttendanceStatus;
};

export type EmployeeDetail = EmployeeListItem & {
  createdAt: string;
};

export type CreateEmployeeRequest = {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  attendanceStatus?: AttendanceStatus;
};
