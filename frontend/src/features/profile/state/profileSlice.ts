import { createSlice } from "@reduxjs/toolkit";
import type { ProfileState } from "../types/profile.types";
import { loadProfileThunk } from "./profileThunks";

const initialState: ProfileState = {
  securityHealth: {
    score: 0,
    faceRegistered: false,
    emailVerified: false,
    pinEnabled: false,
  },
  profileData: null,
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
      .addCase(loadProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.securityHealth = action.payload.securityHealth;
        state.profileData = action.payload.profileData;
      })
      .addCase(loadProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
