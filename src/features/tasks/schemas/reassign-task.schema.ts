import { z } from "zod";

export const buildReassignTaskSchema = (t: (key: string) => string) =>
  z.object({ newAssigneeId: z.number().int().positive(t("validation.required")) });

export type ReassignTaskInput = z.infer<ReturnType<typeof buildReassignTaskSchema>>;
