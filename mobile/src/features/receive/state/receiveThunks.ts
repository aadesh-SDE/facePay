import { createAsyncThunk } from "@reduxjs/toolkit";
import { generatePaymentQR } from "@/features/receive/api/receiveApi";
import type { QRData } from "@/features/receive/types/receive.types";
import { getApiErrorMessage } from "@/shared/lib/getApiErrorMessage";

export const loadMyQRThunk = createAsyncThunk<QRData, void, { rejectValue: string }>(
  "receive/loadMyQR",
  async (_, { rejectWithValue }) => {
    try {
      return await generatePaymentQR();
    } catch (err) {
      return rejectWithValue(getApiErrorMessage(err, "Could not load your QR"));
    }
  },
);
