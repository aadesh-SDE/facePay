import { createAsyncThunk } from "@reduxjs/toolkit";
import type { SecurityHealth } from "../types/profile.types";
import { fetchSecurityHealth } from "../api/profileApi";

export const fetchSecurityHealthThunk = createAsyncThunk<
  SecurityHealth,
  void
>("profile/fetchSecurityHealth", async (_, { rejectWithValue }) => {
  try {
    return await fetchSecurityHealth();
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to load profile",
    );
  }
});
