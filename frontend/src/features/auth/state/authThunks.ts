import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginRequest, SignupRequest, AuthResponse } from "../types/auth.types";
import { loginApi, signupApi, logoutApi } from "../api/authApi";

export const loginThunk = createAsyncThunk<AuthResponse, LoginRequest>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      localStorage.setItem("fp_token", response.token);
      return response;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Login failed",
      );
    }
  },
);

export const signupThunk = createAsyncThunk<AuthResponse, SignupRequest>(
  "auth/signup",
  async (data, { rejectWithValue }) => {
    try {
      const response = await signupApi(data);
      localStorage.setItem("fp_token", response.token);
      return response;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Signup failed",
      );
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async () => {
    await logoutApi();
    localStorage.removeItem("fp_token");
  },
);
