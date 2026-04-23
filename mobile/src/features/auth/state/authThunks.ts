import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/app/store";
import { resetSessionClientState } from "@/app/sessionCleanup";
import { loginApi, logoutApi, signupApi } from "@/features/auth/api/authApi";
import { fetchMeApi } from "@/features/auth/api/profileApi";
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from "@/features/auth/types/auth.types";
import {
  deleteAuthToken,
  getAuthToken,
  setAuthToken,
} from "@/shared/lib/authTokenStorage";
import { getApiErrorMessage } from "@/shared/lib/getApiErrorMessage";

export const bootstrapSessionThunk = createAsyncThunk<User | null, void>(
  "auth/bootstrap",
  async () => {
    const token = await getAuthToken();
    if (!token) return null;
    try {
      return await fetchMeApi();
    } catch {
      await deleteAuthToken();
      return null;
    }
  },
);

export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginApi(credentials);
    await setAuthToken(response.token);
    return response;
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Login failed"));
  }
});

export const signupThunk = createAsyncThunk<
  AuthResponse,
  SignupRequest,
  { rejectValue: string }
>("auth/signup", async (data, { rejectWithValue }) => {
  try {
    const response = await signupApi(data);
    await setAuthToken(response.token);
    return response;
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Signup failed"));
  }
});

export const logoutThunk = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>("auth/logout", async (_, { dispatch }) => {
    try {
      const token = await getAuthToken();
      if (token) await logoutApi();
    } finally {
      await deleteAuthToken();
      resetSessionClientState(dispatch);
    }
  },
);
