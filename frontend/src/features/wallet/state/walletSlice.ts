import { createSlice } from "@reduxjs/toolkit";
import type { WalletState } from "../types/wallet.types";
import { fetchBalanceThunk, addFundsThunk } from "./walletThunks";

const initialState: WalletState = {
  balance: 10_000,
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setBalance(state, action) {
      state.balance = action.payload;
    },
    clearWalletError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalanceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalanceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(fetchBalanceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addFundsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFundsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.newBalance;
      })
      .addCase(addFundsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setBalance, clearWalletError } = walletSlice.actions;
export default walletSlice.reducer;
