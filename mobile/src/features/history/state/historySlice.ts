import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { HistoryState, TransactionFilter } from "@/features/history/types/history.types";
import { fetchTransactionsThunk } from "@/features/history/state/historyThunks";

const initialState: HistoryState = {
  transactions: [],
  filter: "all",
  searchQuery: "",
  loading: false,
  error: null,
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<TransactionFilter>) {
      state.filter = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    resetHistoryData() {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load transactions";
      });
  },
});

export const { setFilter, setSearchQuery, resetHistoryData } = historySlice.actions;
export const historyReducer = historySlice.reducer;
