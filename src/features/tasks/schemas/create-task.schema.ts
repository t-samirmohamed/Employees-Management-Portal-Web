import { z } from "zod";

export const buildCreateTaskSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().trim().min(1, t("validation.required")),
    dueDate: z.string().min(1, t("validation.required")),
    dueTime: z.string().min(1, t("validation.required")),
    assigneeId: z.number().int().positive(),
    notes: z.string().trim().optional(),
    attendanceRequired: z.boolean(),
  });

export type CreateTaskInput = z.infer<ReturnType<typeof buildCreateTaskSchema>>;
