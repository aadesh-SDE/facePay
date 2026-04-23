import { apiClient } from "@/shared/api/client";
import type { DashboardData, RecentTransaction, Transaction } from "@/features/home/types/home.types";

function toRecent(t: Transaction): RecentTransaction {
  return {
    id: t.id,
    direction: t.direction,
    title: t.title,
    subtitle: t.subtitle,
    amount: t.amount,
    timestamp: t.timestamp,
    icon: t.icon,
  };
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const { data } = await apiClient.get<{ items: Transaction[] }>(
    "/api/v1/me/transactions",
    { params: { limit: 5 } },
  );
  return {
    recentTransactions: data.items.map(toRecent),
  };
}
