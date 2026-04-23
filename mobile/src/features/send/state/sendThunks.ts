import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Recipient, TransferResponse } from "@/features/send/types/send.types";
import { getApiErrorMessage } from "@/shared/lib/getApiErrorMessage";
import { searchRecipients, submitTransfer } from "@/features/send/api/sendApi";

export const searchRecipientsThunk = createAsyncThunk<
  Recipient[],
  string,
  { rejectValue: string }
>("send/searchRecipients", async (query, { rejectWithValue }) => {
  try {
    return await searchRecipients(query);
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Search failed"));
  }
});

export const submitTransferThunk = createAsyncThunk<
  TransferResponse,
  { recipientId: string; amount: number; note?: string },
  { state: RootState; rejectValue: string }
>(
  "send/submitTransfer",
  async ({ recipientId, amount, note }, { rejectWithValue, getState }) => {
    const selfId = getState().auth.user?.id;
    if (selfId && recipientId === selfId) {
      return rejectWithValue("You cannot send money to yourself");
    }
    const idempotencyKey =
      typeof globalThis.crypto?.randomUUID === "function"
        ? globalThis.crypto.randomUUID()
        : `fp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    try {
      return await submitTransfer(recipientId, amount, note, idempotencyKey);
    } catch (err) {
      return rejectWithValue(getApiErrorMessage(err, "Transfer failed"));
    }
  },
);
