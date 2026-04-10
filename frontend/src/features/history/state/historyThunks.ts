import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Transaction } from "../types/history.types";
import { fetchTransactions } from "../api/historyApi";

export const fetchTransactionsThunk = createAsyncThunk<Transaction[], void>(
  "history/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTransactions();
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to load transactions",
      );
    }
  },
);
