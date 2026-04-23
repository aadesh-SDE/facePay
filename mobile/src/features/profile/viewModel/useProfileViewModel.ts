import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loadProfileThunk } from "@/features/profile/state/profileThunks";
import { logoutThunk } from "@/features/auth/state/authThunks";

export function useProfileViewModel() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { securityHealth, profileData, loading, error } = useAppSelector(
    (s) => s.profile,
  );

  useEffect(() => {
    void dispatch(loadProfileThunk());
  }, [dispatch]);

  const logout = useCallback(async () => {
    await dispatch(logoutThunk());
  }, [dispatch]);

  return {
    user,
    profileData,
    securityHealth,
    loading,
    error,
    logout,
  };
}
