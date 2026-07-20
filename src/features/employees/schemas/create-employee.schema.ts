import { z } from "zod";

// Mirrors CreateEmployeeRequest exactly, including EF's HasMaxLength caps on
// Employee.FirstName/LastName/Email. Deliberately no `status` field — POST
// /api/employees doesn't accept one; the server always hardcodes "Active".
export const createEmployeeSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().min(1).email().max(256),
  gender: z.enum(["M", "F"]),
  attendanceStatus: z.enum(["InOffice", "Absent", "OnVacation", "OutOfOffice"]).optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
