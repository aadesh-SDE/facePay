import { createAsyncThunk } from "@reduxjs/toolkit";
import type { DashboardData } from "../types/home.types";
import { fetchDashboardData } from "../api/homeApi";

export const fetchDashboardThunk = createAsyncThunk<DashboardData, void>(
  "home/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDashboardData();
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to load dashboard",
      );
    }
  },
);
