import argon2 from "argon2";
import { prisma } from "../../shared/lib/prisma.js";
import { HttpError } from "../../shared/lib/httpError.js";
import { signAccessToken } from "../../shared/lib/jwt.js";
import { normalizeMobile } from "../../shared/lib/money.js";
import type { LoginBody, SignupBody } from "./auth.model.js";

const OPENING_BALANCE_PAISE = 1_000_000n; // ₹10,000 demo

function toPublicUser(u: {
  id: string;
  name: string;
  mobile: string;
  email: string;
  avatarUrl: string | null;
}) {
  return {
    id: u.id,
    name: u.name,
    mobile: u.mobile,
    email: u.email,
    ...(u.avatarUrl ? { avatar: u.avatarUrl } : {}),
  };
}

export async function signup(body: SignupBody) {
  const mobile = normalizeMobile(body.mobile);
  const email = body.email.trim().toLowerCase();

  const exists = await prisma.user.findFirst({
    where: { OR: [{ mobile }, { email }] },
  });
  if (exists) {
    throw new HttpError(409, "CONFLICT", "Mobile or email already registered");
  }

  const passwordHash = await argon2.hash(body.password);

  const user = await prisma.$transaction(async (tx) => {
    const u = await tx.user.create({
      data: {
        name: body.name.trim(),
        mobile,
        email,
        passwordHash,
      },
    });
    await tx.wallet.create({
      data: {
        userId: u.id,
        balanceCents: OPENING_BALANCE_PAISE,
        currency: "INR",
      },
    });
    await tx.ledgerEntry.create({
      data: {
        userId: u.id,
        changeCents: OPENING_BALANCE_PAISE,
        balanceAfterCents: OPENING_BALANCE_PAISE,
        entryType: "opening_credit",
      },
    });
    return u;
  });

  const token = signAccessToken(user.id);
  return { user: toPublicUser(user), token };
}

export async function login(body: LoginBody) {
  const mobile = normalizeMobile(body.mobile);
  const user = await prisma.user.findUnique({ where: { mobile } });
  if (!user) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid mobile number or password");
  }
  const ok = await argon2.verify(user.passwordHash, body.password);
  if (!ok) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid mobile number or password");
  }
  const token = signAccessToken(user.id);
  return { user: toPublicUser(user), token };
}

export async function logout(_userId: string) {
  // Stateless JWT: client drops token. Refresh-token invalidation would go here later.
}
