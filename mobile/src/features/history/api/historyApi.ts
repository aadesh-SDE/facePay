import { apiClient } from "@/shared/api/client";
import type { Transaction } from "@/features/home/types/home.types";

export async function fetchTransactions(): Promise<Transaction[]> {
  const { data } = await apiClient.get<{
    items: Transaction[];
    nextCursor: string | null;
  }>("/api/v1/me/transactions", { params: { limit: 100 } });
  return data.items;
}
