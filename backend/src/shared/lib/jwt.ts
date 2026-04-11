import jwt from "jsonwebtoken";
import { loadEnv } from "./env.js";

export function signAccessToken(userId: string): string {
  const { JWT_SECRET, JWT_EXPIRES_IN } = loadEnv();
  return jwt.sign({ sub: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): { sub: string } {
  const { JWT_SECRET } = loadEnv();
  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded !== "object" || decoded === null || !("sub" in decoded)) {
    throw new Error("INVALID_TOKEN");
  }
  const sub = (decoded as { sub?: string }).sub;
  if (!sub || typeof sub !== "string") throw new Error("INVALID_TOKEN");
  return { sub };
}
