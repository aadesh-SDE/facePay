import type { Prisma } from "@prisma/client";
import { prisma } from "../../shared/lib/prisma.js";
import { HttpError } from "../../shared/lib/httpError.js";
import type { ListUsersQuery } from "./users.model.js";

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

export async function listUsers(selfId: string, q: ListUsersQuery) {
  const search = (q.search ?? "").trim().toLowerCase();
  const take = q.limit + 1;

  const andParts: Prisma.UserWhereInput[] = [{ NOT: { id: selfId } }];

  if (search) {
    andParts.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search.replace(/\s/g, "") } },
      ],
    });
  }

  if (q.cursor) {
    const { t, id } = decodeCursor(q.cursor);
    const ct = new Date(t);
    andParts.push({
      OR: [{ createdAt: { lt: ct } }, { AND: [{ createdAt: ct }, { id: { lt: id } }] }],
    });
  }

  const rows = await prisma.user.findMany({
    where: { AND: andParts },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take,
    select: {
      id: true,
      name: true,
      mobile: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  const hasMore = rows.length > q.limit;
  const items = hasMore ? rows.slice(0, q.limit) : rows;
  const last = items[items.length - 1];
  const nextCursor =
    hasMore && last ? encodeCursor(last.createdAt, last.id) : null;

  return {
    items: items.map((u) => ({
      id: u.id,
      name: u.name,
      mobile: u.mobile,
      ...(u.avatarUrl ? { avatar: u.avatarUrl } : {}),
    })),
    nextCursor,
  };
}

export async function getUserById(requesterId: string, userId: string) {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, mobile: true, avatarUrl: true },
  });
  if (!u) throw new HttpError(404, "NOT_FOUND", "User not found");
  void requesterId;
  return {
    id: u.id,
    name: u.name,
    mobile: u.mobile,
    ...(u.avatarUrl ? { avatar: u.avatarUrl } : {}),
  };
}
