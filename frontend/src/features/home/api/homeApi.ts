import type { DashboardData, RecentTransaction } from "../types/home.types";

const MOCK_DELAY = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const STORAGE_KEY = "fp_transactions";

function getStoredTransactions(): RecentTransaction[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored) as RecentTransaction[];
  return seedTransactions();
}

function seedTransactions(): RecentTransaction[] {
  const now = new Date();
  const today = now.toISOString();
  const yesterday = new Date(now.getTime() - 86_400_000).toISOString();
  const twoDaysAgo = new Date(now.getTime() - 172_800_000).toISOString();

  const seed: RecentTransaction[] = [
    {
      id: "txn_seed_1",
      direction: "sent",
      title: "Sent to Rohan",
      subtitle: "Today, 2:45 PM",
      amount: 2500,
      timestamp: today,
      icon: "call_made",
    },
    {
      id: "txn_seed_2",
      direction: "received",
      title: "Received from Priya",
      subtitle: "Yesterday",
      amount: 1200,
      timestamp: yesterday,
      icon: "call_received",
    },
    {
      id: "txn_seed_3",
      direction: "sent",
      title: "Starbucks Coffee",
      subtitle: formatDateLabel(twoDaysAgo),
      amount: 450,
      timestamp: twoDaysAgo,
      icon: "shopping_bag",
    },
    {
      id: "txn_seed_4",
      direction: "received",
      title: "Received from Aditya",
      subtitle: formatDateLabel(twoDaysAgo),
      amount: 3000,
      timestamp: twoDaysAgo,
      icon: "call_received",
    },
    {
      id: "txn_seed_5",
      direction: "sent",
      title: "Sent to Meera",
      subtitle: formatDateLabel(new Date(now.getTime() - 345_600_000).toISOString()),
      amount: 800,
      timestamp: new Date(now.getTime() - 345_600_000).toISOString(),
      icon: "call_made",
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function formatDateLabel(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function fetchDashboardData(): Promise<DashboardData> {
  await delay(MOCK_DELAY);
  return {
    recentTransactions: getStoredTransactions(),
  };
}
