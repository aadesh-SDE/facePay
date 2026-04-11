import api from "@/shared/services/api";
import type { Recipient, TransferResponse } from "../types/send.types";

const USERS = "/api/v1/users";
const TRANSFERS = "/api/v1/transfers";

export async function searchRecipients(query: string): Promise<Recipient[]> {
  const { data } = await api.get<{ items: Recipient[]; nextCursor: string | null }>(
    USERS,
    { params: { search: query.trim() || undefined, limit: 50 } },
  );
  return data.items;
}

export async function getRecipientById(userId: string): Promise<Recipient> {
  const { data } = await api.get<Recipient>(`${USERS}/${userId}`);
  return data;
}

export async function submitTransfer(
  recipientId: string,
  amount: number,
  note?: string,
  idempotencyKey?: string,
): Promise<TransferResponse> {
  const key = idempotencyKey ?? crypto.randomUUID();
  const { data } = await api.post<TransferResponse>(
    TRANSFERS,
    { recipientId, amount, note: note || undefined },
    { headers: { "Idempotency-Key": key } },
  );
  return data;
}
