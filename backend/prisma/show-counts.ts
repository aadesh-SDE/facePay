/// <reference types="node" />
/** Print row counts for all app tables (read-only). Uses DATABASE_URL from .env. */
import "./loadEnv.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  const [users, wallets, transfers, ledgerEntries, transactions, faceTemplates] =
    await Promise.all([
      prisma.user.count(),
      prisma.wallet.count(),
      prisma.transfer.count(),
      prisma.ledgerEntry.count(),
      prisma.transaction.count(),
      prisma.faceTemplate.count(),
    ]);

  console.log(JSON.stringify({ users, wallets, transfers, ledgerEntries, transactions, faceTemplates }, null, 2));
  const empty = users === 0 && wallets === 0 && transfers === 0 && ledgerEntries === 0 && transactions === 0 && faceTemplates === 0;
  console.log(empty ? "All counts are zero — DB is clean for app data." : "Some rows still exist.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
