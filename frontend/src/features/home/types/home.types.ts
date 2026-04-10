export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  route: string;
}

export type TransactionDirection = "sent" | "received";

export interface RecentTransaction {
  id: string;
  direction: TransactionDirection;
  title: string;
  subtitle: string;
  amount: number;
  timestamp: string;
  icon: string;
}

export interface DashboardData {
  recentTransactions: RecentTransaction[];
}

export interface HomeState {
  recentTransactions: RecentTransaction[];
  loading: boolean;
  error: string | null;
}
