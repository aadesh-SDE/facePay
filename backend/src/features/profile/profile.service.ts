import { prisma } from "../../shared/lib/prisma.js";

export async function getMe(userId: string) {
  const u = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      mobile: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
  const face = await prisma.faceTemplate.findUnique({ where: { userId } });
  return {
    id: u.id,
    name: u.name,
    mobile: u.mobile,
    email: u.email,
    joinedAt: u.createdAt.toISOString(),
    faceRegistered: !!face,
    ...(u.avatarUrl ? { avatar: u.avatarUrl } : {}),
  };
}

export async function getSecuritySummary(userId: string) {
  const u = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { emailVerifiedAt: true },
  });
  const face = await prisma.faceTemplate.findUnique({ where: { userId } });
  const faceRegistered = !!face;
  const emailVerified = !!u.emailVerifiedAt;
  const pinEnabled = false;
  let score = 40;
  if (faceRegistered) score += 30;
  if (emailVerified) score += 15;
  if (pinEnabled) score += 15;
  score = Math.min(100, score);
  return {
    score,
    faceRegistered,
    emailVerified,
    pinEnabled,
  };
}

export async function getReceiveQr(userId: string) {
  const u = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true, name: true, mobile: true },
  });
  return {
    userId: u.id,
    name: u.name,
    mobile: u.mobile,
  };
}
