import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import type { LoginRequest, SignupRequest } from "@/features/auth/types/auth.types";
import { clearAuthError } from "@/features/auth/state/authSlice";
import { loginThunk, logoutThunk, signupThunk } from "@/features/auth/state/authThunks";

export function useAuthViewModel() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error, bootstrapping } = useAppSelector(
    (s) => s.auth,
  );

  const login = useCallback(
    (credentials: LoginRequest) => dispatch(loginThunk(credentials)),
    [dispatch],
  );

  const signup = useCallback(
    (data: SignupRequest) => dispatch(signupThunk(data)),
    [dispatch],
  );

  const logout = useCallback(() => dispatch(logoutThunk()), [dispatch]);

  const clearError = useCallback(
    () => dispatch(clearAuthError()),
    [dispatch],
  );

  return {
    user,
    isAuthenticated,
    loading,
    error,
    bootstrapping,
    login,
    signup,
    logout,
    clearError,
  };
}
