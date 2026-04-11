import { z } from "zod";

export const loginBodySchema = z.object({
  mobile: z.string().min(3).max(32),
  password: z.string().min(1),
});

export const signupBodySchema = z.object({
  name: z.string().min(1).max(120),
  mobile: z.string().min(3).max(32),
  email: z.string().email().max(255),
  password: z.string().min(6).max(128),
});

export type LoginBody = z.infer<typeof loginBodySchema>;
export type SignupBody = z.infer<typeof signupBodySchema>;
