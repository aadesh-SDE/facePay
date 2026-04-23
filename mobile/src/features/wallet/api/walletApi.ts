import { apiClient } from "@/shared/api/client";

const BASE = "/api/v1/me/wallet";

export async function fetchBalance(): Promise<number> {
  const { data } = await apiClient.get<{ balance: number }>(`${BASE}/balance`);
  return data.balance;
}
