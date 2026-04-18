import { createSlice } from "@reduxjs/toolkit";
import type { HomeState } from "../types/home.types";
import { fetchDashboardThunk } from "./homeThunks";

const initialState: HomeState = {
  recentTransactions: [],
  loading: false,
  error: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    clearHomeError(state) {
      state.error = null;
    },
    resetHomeData(state) {
      state.recentTransactions = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.recentTransactions = action.payload.recentTransactions;
      })
      .addCase(fetchDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHomeError, resetHomeData } = homeSlice.actions;
export default homeSlice.reducer;
