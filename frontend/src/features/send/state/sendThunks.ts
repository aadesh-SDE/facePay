import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Recipient, TransferResponse } from "../types/send.types";
import { searchRecipients, submitTransfer } from "../api/sendApi";

export const searchRecipientsThunk = createAsyncThunk<Recipient[], string>(
  "send/searchRecipients",
  async (query, { rejectWithValue }) => {
    try {
      return await searchRecipients(query);
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Search failed",
      );
    }
  },
);

export const submitTransferThunk = createAsyncThunk<
  TransferResponse,
  { recipientId: string; amount: number; note?: string }
>(
  "send/submitTransfer",
  async ({ recipientId, amount, note }, { rejectWithValue }) => {
    try {
      return await submitTransfer(recipientId, amount, note);
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Transfer failed",
      );
    }
  },
);
