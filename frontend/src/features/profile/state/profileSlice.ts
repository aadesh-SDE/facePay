import { createSlice } from "@reduxjs/toolkit";
import type { ProfileState } from "../types/profile.types";
import { fetchSecurityHealthThunk } from "./profileThunks";

const initialState: ProfileState = {
  securityHealth: {
    score: 0,
    faceRegistered: false,
    emailVerified: false,
    pinEnabled: false,
  },
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSecurityHealthThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSecurityHealthThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.securityHealth = action.payload;
      })
      .addCase(fetchSecurityHealthThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
