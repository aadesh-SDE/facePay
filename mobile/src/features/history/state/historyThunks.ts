import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTransactions } from "@/features/history/api/historyApi";
import type { Transaction } from "@/features/home/types/home.types";
import { getApiErrorMessage } from "@/shared/lib/getApiErrorMessage";

export const fetchTransactionsThunk = createAsyncThunk<
  Transaction[],
  void,
  { rejectValue: string }
>("history/fetchTransactions", async (_, { rejectWithValue }) => {
  try {
    return await fetchTransactions();
  } catch (err) {
    return rejectWithValue(
      getApiErrorMessage(err, "Failed to load transactions"),
    );
  }
});
