import type { EmployeeStatus, Gender, Role } from "@shared/types/enums";

export type EmployeeSummary = {
  id: number;
  firstName: string;
  lastName: string;
  status: EmployeeStatus;
  assignedLocationId: number | null;
};

export type UserListItem = {
  id: string;
  email: string;
  role: Role;
  employee: EmployeeSummary | null;
};

export type CreateUserRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  role: Role;
};

export type CreateUserResponse = {
  id: string;
  email: string;
  role: Role;
};
