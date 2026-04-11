import type { Prisma } from "@prisma/client";
import { prisma } from "../../shared/lib/prisma.js";
import { HttpError } from "../../shared/lib/httpError.js";
import { paiseToRupees } from "../../shared/lib/money.js";
import { formatTransactionSubtitle } from "../../shared/lib/transactionFormat.js";
import type { ListTransactionsQuery } from "./transactions.model.js";

function encodeCursor(createdAt: Date, id: string): string {
  return Buffer.from(JSON.stringify({ t: createdAt.toISOString(), id })).toString("base64url");
}

function decodeCursor(cursor: string): { t: string; id: string } {
  try {
    const raw = Buffer.from(cursor, "base64url").toString("utf8");
    const o = JSON.parse(raw) as { t?: string; id?: string };
    if (!o.t || !o.id) throw new Error("bad");
    return { t: o.t, id: o.id };
  } catch {
    throw new HttpError(400, "INVALID_CURSOR", "Invalid cursor");
  }
}

export async function listTransactions(userId: string, q: ListTransactionsQuery) {
  const take = q.limit + 1;
  const andParts: Prisma.TransactionWhereInput[] = [{ userId }];

  if (q.direction) {
    andParts.push({ direction: q.direction });
  }
  if (q.search?.trim()) {
    const s = q.search.trim();
    andParts.push({ title: { contains: s, mode: "insensitive" } });
  }
  if (q.cursor) {
    const { t, id } = decodeCursor(q.cursor);
    const ct = new Date(t);
    andParts.push({
      OR: [{ createdAt: { lt: ct } }, { AND: [{ createdAt: ct }, { id: { lt: id } }] }],
    });
  }

  const rows = await prisma.transaction.findMany({
    where: { AND: andParts },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take,
  });

  const hasMore = rows.length > q.limit;
  const slice = hasMore ? rows.slice(0, q.limit) : rows;
  const last = slice[slice.length - 1];
  const nextCursor =
    hasMore && last ? encodeCursor(last.createdAt, last.id) : null;

  return {
    items: slice.map((r) => ({
      id: r.id,
      direction: r.direction,
      title: r.title,
      subtitle: r.subtitle || formatTransactionSubtitle(r.createdAt),
      amount: paiseToRupees(r.amountCents),
      timestamp: r.createdAt.toISOString(),
      icon: r.icon ?? "payments",
      ...(r.note ? { note: r.note } : {}),
    })),
    nextCursor,
  };
}
