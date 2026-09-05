import { z } from "zod";

export const buildRejectLeaveSchema = (t: (key: string) => string) =>
  z.object({ reason: z.string().trim().min(1, t("validation.required")) });

export type RejectLeaveInput = z.infer<ReturnType<typeof buildRejectLeaveSchema>>;
