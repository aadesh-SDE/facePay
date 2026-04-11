import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SendState, Recipient, SendStatus } from "../types/send.types";
import { submitTransferThunk, searchRecipientsThunk } from "./sendThunks";

const initialState: SendState = {
  recipient: null,
  amount: 0,
  note: "",
  status: "idle",
  transactionId: null,
  loading: false,
  error: null,
  searchLoading: false,
  searchError: null,
  searchResults: [],
};

const sendSlice = createSlice({
  name: "send",
  initialState,
  reducers: {
    setRecipient(state, action: PayloadAction<Recipient>) {
      state.recipient = action.payload;
      state.status = "entering_amount";
    },
    setAmount(state, action: PayloadAction<number>) {
      state.amount = action.payload;
    },
    setNote(state, action: PayloadAction<string>) {
      state.note = action.payload;
    },
    setStatus(state, action: PayloadAction<SendStatus>) {
      state.status = action.payload;
    },
    resetSend() {
      return { ...initialState };
    },
    clearSendError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitTransferThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitTransferThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "success";
        state.transactionId = action.payload.transactionId;
      })
      .addCase(submitTransferThunk.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(searchRecipientsThunk.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchRecipientsThunk.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchRecipientsThunk.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload as string;
        state.searchResults = [];
      });
  },
});

export const {
  setRecipient,
  setAmount,
  setNote,
  setStatus,
  resetSend,
  clearSendError,
} = sendSlice.actions;

export default sendSlice.reducer;
