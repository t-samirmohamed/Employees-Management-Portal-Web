// Mirrors the exact wire values of the backend's C# enums (Gender, EmployeeStatus,
// AttendanceStatus in EmpoloyeeManagment/Models/Enums.cs) — these strings are what
// actually appear in JSON, not translated labels.
export type Gender = "M" | "F";
export type EmployeeStatus = "Active" | "Inactive";
export type AttendanceStatus = "InOffice" | "Absent" | "OnVacation" | "OutOfOffice";
export type Role = "Admin" | "Manager" | "Supervisor" | "Employee";
export type TaskItemStatus = "New" | "InProgress" | "Rejected" | "Cancelled" | "Done";
export type LeaveRequestStatus = "Pending" | "Accepted" | "Rejected" | "DelayRequested";
