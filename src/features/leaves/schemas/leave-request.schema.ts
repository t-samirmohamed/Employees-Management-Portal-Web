import { z } from "zod";

export const buildLeaveRequestSchema = (t: (key: string) => string) =>
  z
    .object({
      startDate: z.string().min(1, t("validation.required")),
      endDate: z.string().min(1, t("validation.required")),
      reason: z.string().trim().min(1, t("validation.required")),
    })
    .refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
      path: ["endDate"],
      error: t("leaves.validation.endBeforeStart"),
    });

export type LeaveRequestInput = z.infer<ReturnType<typeof buildLeaveRequestSchema>>;
