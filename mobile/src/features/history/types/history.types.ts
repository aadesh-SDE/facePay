import type { Transaction } from "@/features/home/types/home.types";

export type TransactionFilter = "all" | "sent" | "received";

export interface HistoryState {
  transactions: Transaction[];
  filter: TransactionFilter;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}
