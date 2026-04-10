import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ReceiveState, QRData, ScanResult } from "../types/receive.types";

const initialState: ReceiveState = {
  qrData: null,
  scanResult: null,
  loading: false,
  error: null,
};

const receiveSlice = createSlice({
  name: "receive",
  initialState,
  reducers: {
    setQRData(state, action: PayloadAction<QRData>) {
      state.qrData = action.payload;
    },
    setScanResult(state, action: PayloadAction<ScanResult>) {
      state.scanResult = action.payload;
    },
    clearScanResult(state) {
      state.scanResult = null;
    },
    clearReceiveError(state) {
      state.error = null;
    },
  },
});

export const { setQRData, setScanResult, clearScanResult, clearReceiveError } =
  receiveSlice.actions;
export default receiveSlice.reducer;
