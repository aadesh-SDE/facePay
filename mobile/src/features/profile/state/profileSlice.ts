import { createSlice } from "@reduxjs/toolkit";
import type { ProfileState } from "@/features/profile/types/profile.types";
import { loadProfileThunk } from "@/features/profile/state/profileThunks";

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
    resetProfileData() {
      return { ...initialState };
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
        state.error = action.payload ?? "Failed to load profile";
      });
  },
});

export const { clearProfileError, resetProfileData } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
