import { prisma } from "../../shared/lib/prisma.js";
import { HttpError } from "../../shared/lib/httpError.js";
import { paiseToRupees, rupeesToPaise } from "../../shared/lib/money.js";
import type { AddFundsBody } from "./wallet.model.js";

export async function getBalance(userId: string) {
  const w = await prisma.wallet.findUnique({ where: { userId } });
  if (!w) throw new HttpError(404, "NOT_FOUND", "Wallet not found");
  return { balance: paiseToRupees(w.balanceCents) };
}

export async function addFunds(userId: string, body: AddFundsBody) {
  const delta = rupeesToPaise(body.amount);
  const now = new Date().toISOString();
  const result = await prisma.$transaction(async (tx) => {
    const w = await tx.wallet.findUniqueOrThrow({ where: { userId } });
    const newBal = w.balanceCents + delta;
    await tx.wallet.update({
      where: { userId },
      data: { balanceCents: newBal },
    });
    await tx.ledgerEntry.create({
      data: {
        userId,
        changeCents: delta,
        balanceAfterCents: newBal,
        entryType: "top_up",
      },
    });
    return { newBalance: paiseToRupees(newBal), timestamp: now };
  });
  return result;
}
