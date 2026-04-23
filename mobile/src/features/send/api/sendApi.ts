import { apiClient } from "@/shared/api/client";
import type { Recipient, TransferResponse } from "@/features/send/types/send.types";

const USERS = "/api/v1/users";
const TRANSFERS = "/api/v1/transfers";

export async function searchRecipients(query: string): Promise<Recipient[]> {
  const { data } = await apiClient.get<{
    items: Recipient[];
    nextCursor: string | null;
  }>(USERS, { params: { search: query.trim() || undefined, limit: 50 } });
  return data.items;
}

export async function getRecipientById(userId: string): Promise<Recipient> {
  const { data } = await apiClient.get<Recipient>(`${USERS}/${userId}`);
  return data;
}

export async function submitTransfer(
  recipientId: string,
  amount: number,
  note?: string,
  idempotencyKey?: string,
): Promise<TransferResponse> {
  const key =
    idempotencyKey ??
    (typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `fp-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const { data } = await apiClient.post<TransferResponse>(
    TRANSFERS,
    { recipientId, amount, note: note || undefined },
    { headers: { "Idempotency-Key": key } },
  );
  return data;
}
