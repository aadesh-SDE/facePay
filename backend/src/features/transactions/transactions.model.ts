import { z } from "zod";

export const listTransactionsQuerySchema = z.object({
  direction: z.enum(["sent", "received"]).optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;
