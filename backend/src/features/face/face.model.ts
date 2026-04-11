import { z } from "zod";

export const putFaceBodySchema = z.object({
  descriptor: z.array(z.number()),
});

export type PutFaceBody = z.infer<typeof putFaceBodySchema>;
