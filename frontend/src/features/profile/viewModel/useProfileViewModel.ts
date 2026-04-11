import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { loadProfileThunk } from "../state/profileThunks";
import { logoutThunk } from "@/features/auth/state/authThunks";
import { resetAllFaceState } from "@/features/faceAuth/state/faceSlice";

export function useProfileViewModel() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { securityHealth, profileData, loading } = useSelector(
    (state: RootState) => state.profile,
  );

  useEffect(() => {
    dispatch(loadProfileThunk());
  }, [dispatch]);

  const logout = useCallback(async () => {
    await dispatch(logoutThunk());
    dispatch(resetAllFaceState());
  }, [dispatch]);

  return {
    user,
    profileData,
    securityHealth,
    loading,
    logout,
  };
}
