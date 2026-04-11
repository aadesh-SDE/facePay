import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AddFundsRequest, AddFundsResult } from "../types/wallet.types";
import { fetchBalance, addFunds } from "../api/walletApi";
import { getApiErrorMessage } from "@/shared/lib/getApiErrorMessage";

export const fetchBalanceThunk = createAsyncThunk<number, void>(
  "wallet/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchBalance();
    } catch (err) {
      return rejectWithValue(
        getApiErrorMessage(err, "Failed to fetch balance"),
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
      return rejectWithValue(getApiErrorMessage(err, "Failed to add funds"));
    }
  },
);
