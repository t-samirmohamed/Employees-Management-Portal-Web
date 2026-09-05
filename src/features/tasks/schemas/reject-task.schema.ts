import { z } from "zod";

export const buildRejectTaskSchema = (t: (key: string) => string) =>
  z.object({ reason: z.string().trim().min(1, t("validation.required")) });

export type RejectTaskInput = z.infer<ReturnType<typeof buildRejectTaskSchema>>;
