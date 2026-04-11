import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().optional().default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("7d"),
  FACE_TEMPLATE_ENCRYPTION_KEY: z.string().min(16),
  CORS_ORIGINS: z.string().optional().default("http://localhost:5173,http://localhost:4173,https://facepay-bice.vercel.app"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function loadEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors;
    throw new Error(`Invalid environment: ${JSON.stringify(msg)}`);
  }
  cached = parsed.data;
  return cached;
}

export function corsOriginList(): string[] {
  return loadEnv()
    .CORS_ORIGINS.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
