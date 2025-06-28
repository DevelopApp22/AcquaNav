import z from "zod";

export const rejectedNavigationPlan = z.object({
  reason: z.string(),
}).strict();
