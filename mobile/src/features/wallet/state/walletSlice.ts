import { createSlice } from "@reduxjs/toolkit";
import type { WalletState } from "@/features/wallet/types/wallet.types";
import { fetchBalanceThunk } from "@/features/wallet/state/walletThunks";

const initialState: WalletState = {
  balance: 0,
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearWalletError(state) {
      state.error = null;
    },
    resetWallet(state) {
      state.balance = 0;
      state.loading = false;
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
        state.error = action.payload ?? "Failed to fetch balance";
      });
  },
});

export const { clearWalletError, resetWallet } = walletSlice.actions;
export const walletReducer = walletSlice.reducer;
