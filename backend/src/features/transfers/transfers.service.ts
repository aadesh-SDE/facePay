import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/lib/prisma.js";
import { HttpError } from "../../shared/lib/httpError.js";
import { paiseToRupees, rupeesToPaise } from "../../shared/lib/money.js";
import { formatTransactionSubtitle } from "../../shared/lib/transactionFormat.js";
import type { TransferBody } from "./transfers.model.js";

function mapAmountError(err: unknown): never {
  if (err instanceof Error) {
    if (err.message === "TOO_MANY_DECIMALS") {
      throw new HttpError(400, "VALIDATION_ERROR", "Amount must have at most 2 decimal places");
    }
    if (err.message === "INVALID_AMOUNT") {
      throw new HttpError(400, "VALIDATION_ERROR", "Invalid amount");
    }
    if (err.message === "AMOUNT_TOO_LARGE") {
      throw new HttpError(400, "VALIDATION_ERROR", "Amount exceeds transfer limit");
    }
  }
  throw err;
}

export async function executeTransfer(
  senderId: string,
  idempotencyKey: string,
  body: TransferBody,
): Promise<{ response: Record<string, unknown>; isReplay: boolean }> {
  let amountCents: bigint;
  try {
    amountCents = rupeesToPaise(body.amount);
  } catch (e) {
    mapAmountError(e);
  }

  const existing = await prisma.transfer.findUnique({
    where: {
      senderUserId_idempotencyKey: {
        senderUserId: senderId,
        idempotencyKey,
      },
    },
  });

  if (existing?.status === "completed") {
    const w = await prisma.wallet.findUniqueOrThrow({ where: { userId: senderId } });
    return {
      isReplay: true,
      response: {
        transactionId: existing.id,
        amount: paiseToRupees(existing.amountCents),
        recipientId: existing.recipientUserId,
        timestamp: existing.createdAt.toISOString(),
        newBalance: paiseToRupees(w.balanceCents),
      },
    };
  }

  if (senderId === body.recipientId) {
    throw new HttpError(400, "SELF_TRANSFER", "Cannot send money to yourself");
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const recipient = await tx.user.findUnique({ where: { id: body.recipientId } });
        if (!recipient) {
          throw new HttpError(404, "NOT_FOUND", "Recipient not found");
        }

        const senderWallet = await tx.wallet.findUniqueOrThrow({ where: { userId: senderId } });
        const recipientWallet = await tx.wallet.findUniqueOrThrow({
          where: { userId: body.recipientId },
        });

        if (senderWallet.balanceCents < amountCents) {
          throw new HttpError(400, "INSUFFICIENT_FUNDS", "Insufficient balance");
        }

        const transfer = await tx.transfer.create({
          data: {
            idempotencyKey,
            senderUserId: senderId,
            recipientUserId: body.recipientId,
            amountCents,
            note: body.note ?? null,
            status: "completed",
          },
        });

        const senderNew = senderWallet.balanceCents - amountCents;
        const recipientNew = recipientWallet.balanceCents + amountCents;

        await tx.wallet.update({
          where: { userId: senderId },
          data: { balanceCents: senderNew },
        });
        await tx.wallet.update({
          where: { userId: body.recipientId },
          data: { balanceCents: recipientNew },
        });

        await tx.ledgerEntry.create({
          data: {
            userId: senderId,
            changeCents: -amountCents,
            balanceAfterCents: senderNew,
            entryType: "transfer_out",
            transferId: transfer.id,
            metadata: { idempotencyKey },
          },
        });
        await tx.ledgerEntry.create({
          data: {
            userId: body.recipientId,
            changeCents: amountCents,
            balanceAfterCents: recipientNew,
            entryType: "transfer_in",
            transferId: transfer.id,
          },
        });

        const sub = formatTransactionSubtitle(transfer.createdAt);
        const senderUser = await tx.user.findUniqueOrThrow({
          where: { id: senderId },
          select: { name: true },
        });

        await tx.transaction.create({
          data: {
            userId: senderId,
            direction: "sent",
            title: `Sent to ${recipient.name}`,
            subtitle: sub,
            amountCents,
            peerUserId: body.recipientId,
            transferId: transfer.id,
            icon: "call_made",
            note: body.note ?? null,
          },
        });
        await tx.transaction.create({
          data: {
            userId: body.recipientId,
            direction: "received",
            title: `Received from ${senderUser.name}`,
            subtitle: sub,
            amountCents,
            peerUserId: senderId,
            transferId: transfer.id,
            icon: "call_received",
            note: body.note ?? null,
          },
        });

        return {
          transactionId: transfer.id,
          amount: body.amount,
          recipientId: body.recipientId,
          timestamp: transfer.createdAt.toISOString(),
          newBalance: paiseToRupees(senderNew),
        };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    return { isReplay: false, response: result };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      const ex = await prisma.transfer.findUniqueOrThrow({
        where: {
          senderUserId_idempotencyKey: { senderUserId: senderId, idempotencyKey },
        },
      });
      const w = await prisma.wallet.findUniqueOrThrow({ where: { userId: senderId } });
      return {
        isReplay: true,
        response: {
          transactionId: ex.id,
          amount: paiseToRupees(ex.amountCents),
          recipientId: ex.recipientUserId,
          timestamp: ex.createdAt.toISOString(),
          newBalance: paiseToRupees(w.balanceCents),
        },
      };
    }
    throw e;
  }
}
