import { z } from "zod";

export const transferBodySchema = z.object({
  recipientId: z.string().uuid(),
  amount: z.number().positive(),
  note: z.string().max(500).optional(),
});

export type TransferBody = z.infer<typeof transferBodySchema>;
