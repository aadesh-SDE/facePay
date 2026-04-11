import api from "@/shared/services/api";
import type { Transaction } from "../types/history.types";

export async function fetchTransactions(): Promise<Transaction[]> {
  const { data } = await api.get<{ items: Transaction[]; nextCursor: string | null }>(
    "/api/v1/me/transactions",
    { params: { limit: 100 } },
  );
  return data.items;
}
