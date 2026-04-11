import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Transaction } from "../types/history.types";
import { fetchTransactions } from "../api/historyApi";
import { getApiErrorMessage } from "@/shared/lib/getApiErrorMessage";

export const fetchTransactionsThunk = createAsyncThunk<Transaction[], void>(
  "history/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTransactions();
    } catch (err) {
      return rejectWithValue(
        getApiErrorMessage(err, "Failed to load transactions"),
      );
    }
  },
);
