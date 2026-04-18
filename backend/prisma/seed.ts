/**
 * Dev-only seed. Default login: mobile 9876543210, password demo123
 */
import "./loadEnv.js";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

const OPENING_PAISE = 1_000_000n; // ₹10,000

const DIRECTORY = [
  { name: "Rohan Sharma", mobile: "9876543201", email: "rohan@facepay.demo" },
  { name: "Priya Patel", mobile: "9876543202", email: "priya@facepay.demo" },
  { name: "Aditya Kumar", mobile: "9876543203", email: "aditya@facepay.demo" },
  { name: "Meera Joshi", mobile: "9876543204", email: "meera@facepay.demo" },
  { name: "Vikram Singh", mobile: "9876543205", email: "vikram@facepay.demo" },
  { name: "Ananya Reddy", mobile: "9876543206", email: "ananya@facepay.demo" },
  { name: "Karan Malhotra", mobile: "9876543207", email: "karan@facepay.demo" },
  { name: "Sneha Gupta", mobile: "9876543208", email: "sneha@facepay.demo" },
];

async function upsertUser(
  name: string,
  mobile: string,
  email: string,
  password: string,
  emailVerified: boolean,
) {
  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.upsert({
    where: { mobile },
    update: { name, email: email.toLowerCase(), passwordHash },
    create: {
      name,
      mobile,
      email: email.toLowerCase(),
      passwordHash,
      emailVerifiedAt: emailVerified ? new Date() : null,
    },
  });

  await prisma.wallet.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      balanceCents: OPENING_PAISE,
      currency: "INR",
    },
  });

  const w = await prisma.wallet.findUniqueOrThrow({ where: { userId: user.id } });
  const hasLedger = await prisma.ledgerEntry.count({
    where: { userId: user.id, entryType: "opening_credit" },
  });
  if (hasLedger === 0) {
    await prisma.ledgerEntry.create({
      data: {
        userId: user.id,
        changeCents: OPENING_PAISE,
        balanceAfterCents: w.balanceCents,
        entryType: "opening_credit",
      },
    });
  }

  return user;
}

async function main() {
  const main = await upsertUser(
    "Adesh M",
    "9876543210",
    "adesh@facepay.demo",
    "demo123",
    true,
  );

  for (const d of DIRECTORY) {
    await upsertUser(d.name, d.mobile, d.email, "demo123", false);
  }

  const now = new Date();
  const feedCount = await prisma.transaction.count({ where: { userId: main.id } });
  if (feedCount === 0) {
    await prisma.transaction.createMany({
      data: [
        {
          userId: main.id,
          direction: "sent",
          title: "Sent to Rohan Sharma",
          subtitle: "Demo seed",
          amountCents: 250_000n,
          icon: "call_made",
          createdAt: new Date(now.getTime() - 86_400_000),
        },
        {
          userId: main.id,
          direction: "received",
          title: "Received from Priya Patel",
          subtitle: "Demo seed",
          amountCents: 120_000n,
          icon: "call_received",
          createdAt: new Date(now.getTime() - 172_800_000),
        },
      ],
    });
  }

  console.log("Seed complete. Login: 9876543210 / demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
