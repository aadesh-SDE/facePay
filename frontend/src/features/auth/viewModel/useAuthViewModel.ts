import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import type { LoginRequest, SignupRequest } from "../types/auth.types";
import { loginThunk, signupThunk, logoutThunk } from "../state/authThunks";
import { clearAuthError } from "../state/authSlice";

export function useAuthViewModel() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const login = useCallback(
    (credentials: LoginRequest) => dispatch(loginThunk(credentials)),
    [dispatch],
  );

  const signup = useCallback(
    (data: SignupRequest) => dispatch(signupThunk(data)),
    [dispatch],
  );

  const logout = useCallback(
    () => dispatch(logoutThunk()),
    [dispatch],
  );

  const clearError = useCallback(
    () => dispatch(clearAuthError()),
    [dispatch],
  );

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout,
    clearError,
  };
}
