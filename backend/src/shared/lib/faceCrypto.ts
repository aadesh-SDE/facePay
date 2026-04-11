import crypto from "crypto";
import { loadEnv } from "./env.js";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;

function key32(): Buffer {
  return crypto.createHash("sha256").update(loadEnv().FACE_TEMPLATE_ENCRYPTION_KEY).digest();
}

export function encryptDescriptorJson(plainUtf8: string): Buffer {
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key32(), iv);
  const enc = Buffer.concat([cipher.update(plainUtf8, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]);
}

export function decryptDescriptorJson(buf: Buffer): string | null {
  try {
    if (buf.length < IV_LEN + 16 + 1) return null;
    const iv = buf.subarray(0, IV_LEN);
    const tag = buf.subarray(IV_LEN, IV_LEN + 16);
    const data = buf.subarray(IV_LEN + 16);
    const decipher = crypto.createDecipheriv(ALGO, key32(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}
