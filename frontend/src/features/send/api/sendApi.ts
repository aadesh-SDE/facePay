import type { Recipient, TransferResponse } from "../types/send.types";

const MOCK_DELAY = 600;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MOCK_CONTACTS: Recipient[] = [
  { id: "usr_r1", name: "Rohan Sharma", mobile: "9876543201" },
  { id: "usr_r2", name: "Priya Patel", mobile: "9876543202" },
  { id: "usr_r3", name: "Aditya Kumar", mobile: "9876543203" },
  { id: "usr_r4", name: "Meera Joshi", mobile: "9876543204" },
  { id: "usr_r5", name: "Vikram Singh", mobile: "9876543205" },
  { id: "usr_r6", name: "Ananya Reddy", mobile: "9876543206" },
  { id: "usr_r7", name: "Karan Malhotra", mobile: "9876543207" },
  { id: "usr_r8", name: "Sneha Gupta", mobile: "9876543208" },
];

export async function searchRecipients(query: string): Promise<Recipient[]> {
  await delay(MOCK_DELAY);
  if (!query.trim()) return MOCK_CONTACTS;

  const q = query.toLowerCase().replace(/\s/g, "");
  return MOCK_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.mobile.includes(q),
  );
}

export async function submitTransfer(
  recipientId: string,
  amount: number,
  note?: string,
): Promise<TransferResponse> {
  await delay(MOCK_DELAY);

  const balanceKey = "fp_wallet_balance";
  const stored = localStorage.getItem(balanceKey);
  const balance = stored ? parseFloat(stored) : 10_000;

  if (amount > balance) {
    throw new Error("Insufficient balance");
  }

  const newBalance = balance - amount;
  localStorage.setItem(balanceKey, newBalance.toString());

  const txn: TransferResponse = {
    transactionId: `txn_${Date.now()}`,
    amount,
    recipientId,
    timestamp: new Date().toISOString(),
    newBalance,
  };

  const recipient = MOCK_CONTACTS.find((c) => c.id === recipientId);
  const txKey = "fp_transactions";
  const existing = JSON.parse(localStorage.getItem(txKey) || "[]");
  existing.unshift({
    id: txn.transactionId,
    direction: "sent",
    title: `Sent to ${recipient?.name ?? "Unknown"}`,
    subtitle: "Just now",
    amount,
    timestamp: txn.timestamp,
    icon: "call_made",
    note: note || undefined,
  });
  localStorage.setItem(txKey, JSON.stringify(existing));

  return txn;
}
