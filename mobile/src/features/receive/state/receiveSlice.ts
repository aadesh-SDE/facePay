import { createSlice } from "@reduxjs/toolkit";
import type { ReceiveState } from "@/features/receive/types/receive.types";
import { loadMyQRThunk } from "@/features/receive/state/receiveThunks";

const initialState: ReceiveState = {
  qrData: null,
  loading: false,
  error: null,
};

const receiveSlice = createSlice({
  name: "receive",
  initialState,
  reducers: {
    resetReceiveData() {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMyQRThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMyQRThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.qrData = action.payload;
      })
      .addCase(loadMyQRThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Could not load your QR";
      });
  },
});

export const { resetReceiveData } = receiveSlice.actions;
export const receiveReducer = receiveSlice.reducer;
