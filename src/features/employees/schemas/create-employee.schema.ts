import { z } from "zod";

type Translator = (key: string, values?: Record<string, string | number>) => string;

// Mirrors CreateEmployeeRequest exactly, including EF's HasMaxLength caps on
// Employee.FirstName/LastName/Email. Deliberately no `status` field — POST
// /api/employees doesn't accept one; the server always hardcodes "Active".
export const buildCreateEmployeeSchema = (t: Translator) =>
  z.object({
    firstName: z
      .string()
      .trim()
      .min(1, t("validation.required"))
      .max(100, t("validation.maxLength", { max: 100 })),
    lastName: z
      .string()
      .trim()
      .min(1, t("validation.required"))
      .max(100, t("validation.maxLength", { max: 100 })),
    email: z
      .string()
      .trim()
      .min(1, t("validation.required"))
      .email(t("validation.invalidEmail"))
      .max(256, t("validation.maxLength", { max: 256 })),
    gender: z.enum(["M", "F"]),
    attendanceStatus: z.enum(["InOffice", "Absent", "OnVacation", "OutOfOffice"]).optional(),
  });

export type CreateEmployeeInput = z.infer<ReturnType<typeof buildCreateEmployeeSchema>>;
