/// <reference types="node" />
/**
 * Deletes every user and all related rows (wallets, transfers, transactions, etc.).
 * Requires CONFIRM_WIPE=yes so it is not run by accident.
 *
 * Usage (from backend/):
 *   CONFIRM_WIPE=yes npx tsx prisma/wipe-all-users.ts
 *
 * Uses DATABASE_URL from .env (local, Neon, or copy from Render for one-off wipe).
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (process.env.CONFIRM_WIPE !== "yes") {
    console.error("Refusing to run: set CONFIRM_WIPE=yes (deletes all users and related data).");
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Add it to backend/.env or export it.");
    process.exit(1);
  }

  await prisma.$transaction(async (tx) => {
    await tx.transaction.deleteMany();
    await tx.ledgerEntry.deleteMany();
    await tx.transfer.deleteMany();
    await tx.faceTemplate.deleteMany();
    await tx.wallet.deleteMany();
    await tx.user.deleteMany();
  });

  console.log("Done: all users and related data removed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
