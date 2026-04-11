import { createAsyncThunk } from "@reduxjs/toolkit";
import type { DashboardData } from "../types/home.types";
import { fetchDashboardData } from "../api/homeApi";
import { getApiErrorMessage } from "@/shared/lib/getApiErrorMessage";

export const fetchDashboardThunk = createAsyncThunk<DashboardData, void>(
  "home/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchDashboardData();
    } catch (err) {
      return rejectWithValue(
        getApiErrorMessage(err, "Failed to load dashboard"),
      );
    }
  },
);
