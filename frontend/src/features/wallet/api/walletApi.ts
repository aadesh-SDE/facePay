import api from "@/shared/services/api";
import type { AddFundsRequest, AddFundsResult } from "../types/wallet.types";

const BASE = "/api/v1/me/wallet";

export async function fetchBalance(): Promise<number> {
  const { data } = await api.get<{ balance: number }>(`${BASE}/balance`);
  return data.balance;
}

export async function addFunds(req: AddFundsRequest): Promise<AddFundsResult> {
  const { data } = await api.post<AddFundsResult>(`${BASE}/add-funds`, {
    amount: req.amount,
  });
  return data;
}
