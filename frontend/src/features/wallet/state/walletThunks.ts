import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AddFundsRequest, AddFundsResult } from "../types/wallet.types";
import { fetchBalance, addFunds } from "../api/walletApi";

export const fetchBalanceThunk = createAsyncThunk<number, void>(
  "wallet/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchBalance();
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch balance",
      );
    }
  },
);

export const addFundsThunk = createAsyncThunk<AddFundsResult, AddFundsRequest>(
  "wallet/addFunds",
  async (req, { rejectWithValue }) => {
    try {
      return await addFunds(req);
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to add funds",
      );
    }
  },
);
