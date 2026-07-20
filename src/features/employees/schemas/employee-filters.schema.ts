import { z } from "zod";

export const employeeFiltersSchema = z.object({
  gender: z.enum(["M", "F"]).optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
  attendanceStatus: z.enum(["InOffice", "Absent", "OnVacation", "OutOfOffice"]).optional(),
});

export type EmployeeFiltersInput = z.infer<typeof employeeFiltersSchema>;

// An empty query string value (e.g. ?gender=) is "" not undefined, and "" fails
// enum validation — normalize each param before handing off to the schema.
export function parseEmployeeFilters(searchParams: URLSearchParams): EmployeeFiltersInput {
  const result = employeeFiltersSchema.safeParse({
    gender: searchParams.get("gender") || undefined,
    status: searchParams.get("status") || undefined,
    attendanceStatus: searchParams.get("attendanceStatus") || undefined,
  });
  return result.success ? result.data : {};
}
