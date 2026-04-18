import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { HistoryState, TransactionFilter } from "../types/history.types";
import { fetchTransactionsThunk } from "./historyThunks";

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
    resetHistoryData(state) {
      state.transactions = [];
      state.filter = "all";
      state.searchQuery = "";
      state.loading = false;
      state.error = null;
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
        state.error = action.payload as string;
      });
  },
});

export const { setFilter, setSearchQuery, resetHistoryData } =
  historySlice.actions;
export default historySlice.reducer;
