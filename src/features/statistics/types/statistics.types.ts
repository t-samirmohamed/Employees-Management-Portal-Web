// The API only includes keys that actually occur (no zero-filled entries for
// statuses with zero employees), so consumers must handle sparse records.
export type EmployeeStatistics = {
  totalEmployees: number;
  byGender: Record<string, number>;
  byStatus: Record<string, number>;
  byAttendanceStatus: Record<string, number>;
};
