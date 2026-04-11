import { z } from "zod";

export const addFundsBodySchema = z.object({
  amount: z.number().positive().max(1_000_000),
});

export type AddFundsBody = z.infer<typeof addFundsBodySchema>;
