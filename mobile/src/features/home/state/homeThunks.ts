import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDashboardData } from "@/features/home/api/homeApi";
import type { DashboardData } from "@/features/home/types/home.types";
import { getApiErrorMessage } from "@/shared/lib/getApiErrorMessage";

export const fetchDashboardThunk = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>("home/fetchDashboard", async (_, { rejectWithValue }) => {
  try {
    return await fetchDashboardData();
  } catch (err) {
    return rejectWithValue(
      getApiErrorMessage(err, "Failed to load dashboard"),
    );
  }
});
