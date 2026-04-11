import { z } from "zod";

export const listUsersQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
