import api from "@/shared/services/api";
import type { DashboardData, RecentTransaction } from "../types/home.types";
import type { Transaction } from "@/features/history/types/history.types";

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
  const { data } = await api.get<{ items: Transaction[] }>(
    "/api/v1/me/transactions",
    { params: { limit: 5 } },
  );
  return {
    recentTransactions: data.items.map(toRecent),
  };
}
