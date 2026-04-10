export type TransactionDirection = "sent" | "received";
export type TransactionFilter = "all" | "sent" | "received";

export interface Transaction {
  id: string;
  direction: TransactionDirection;
  title: string;
  subtitle: string;
  amount: number;
  timestamp: string;
  icon: string;
  note?: string;
}

export interface DateGroup {
  label: string;
  transactions: Transaction[];
}

export interface HistoryState {
  transactions: Transaction[];
  filter: TransactionFilter;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}
