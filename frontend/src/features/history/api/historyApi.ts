import type { Transaction } from "../types/history.types";

const MOCK_DELAY = 500;
const STORAGE_KEY = "fp_transactions";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchTransactions(): Promise<Transaction[]> {
  await delay(MOCK_DELAY);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored) as Transaction[];
}
