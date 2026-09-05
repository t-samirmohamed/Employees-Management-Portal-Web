// The API only includes keys that actually occur (no zero-filled entries for
// statuses with zero employees), so consumers must handle sparse records.
export type EmployeeStatistics = {
  totalEmployees: number;
  byGender: Record<string, number>;
  byStatus: Record<string, number>;
  byAttendanceStatus: Record<string, number>;
};

export type EmployeeMonthlyActivity = {
  employeeId: number;
  year: number;
  month: number;
  totalTasks: number;
  tasksByStatus: Record<string, number>;
  totalVisits: number;
  visitsByStatus: Record<string, number>;
  currentAttendanceStatus: string;
  attendanceDrivingTaskCount: number;
};

export type StatusStats = {
  tasksByStatus: Record<string, number>;
  visitsByStatus: Record<string, number>;
};

export type MostVisitedClient = {
  clientId: number;
  clientName: string;
  visitCount: number;
};

export type SupervisorTeamStats = {
  supervisorEmployeeId: number;
  supervisorName: string;
  assignedClientId: number | null;
  assignedClientName: string | null;
  teamEmployeeIds: number[];
  openTaskCount: number;
  teamAttendanceStatusBreakdown: Record<string, number>;
};
