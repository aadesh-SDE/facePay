import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBalance } from "@/features/wallet/api/walletApi";
import { getApiErrorMessage } from "@/shared/lib/getApiErrorMessage";

export const fetchBalanceThunk = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>("wallet/fetchBalance", async (_, { rejectWithValue }) => {
  try {
    return await fetchBalance();
  } catch (err) {
    return rejectWithValue(
      getApiErrorMessage(err, "Failed to fetch balance"),
    );
  }
});
