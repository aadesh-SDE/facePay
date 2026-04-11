import { prisma } from "../../shared/lib/prisma.js";
import { encryptDescriptorJson, decryptDescriptorJson } from "../../shared/lib/faceCrypto.js";
import type { PutFaceBody } from "./face.model.js";

const ALGO_VERSION = "face-api-v1";

export async function saveTemplate(userId: string, body: PutFaceBody) {
  const plain = JSON.stringify(body.descriptor);
  const ciphertextBuf = encryptDescriptorJson(plain);
  const ciphertext = new Uint8Array(ciphertextBuf);
  await prisma.faceTemplate.upsert({
    where: { userId },
    create: {
      userId,
      ciphertext,
      algorithmVersion: ALGO_VERSION,
    },
    update: {
      ciphertext,
      algorithmVersion: ALGO_VERSION,
    },
  });
  return { success: true as const };
}

export async function getTemplate(userId: string) {
  const row = await prisma.faceTemplate.findUnique({ where: { userId } });
  if (!row) return { descriptor: null as number[] | null };
  const plain = decryptDescriptorJson(Buffer.from(row.ciphertext));
  if (!plain) return { descriptor: null as number[] | null };
  try {
    const arr = JSON.parse(plain) as unknown;
    if (!Array.isArray(arr)) return { descriptor: null };
    return { descriptor: arr as number[] };
  } catch {
    return { descriptor: null };
  }
}

export async function deleteTemplate(userId: string) {
  await prisma.faceTemplate.deleteMany({ where: { userId } });
}
