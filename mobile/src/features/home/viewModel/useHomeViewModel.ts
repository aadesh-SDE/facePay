import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchDashboardThunk } from "@/features/home/state/homeThunks";
import { fetchBalanceThunk } from "@/features/wallet/state/walletThunks";

export function useHomeViewModel() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { balance, loading: walletLoading } = useAppSelector((s) => s.wallet);
  const {
    recentTransactions,
    loading: homeLoading,
    error: homeError,
  } = useAppSelector((s) => s.home);
  const { error: walletError } = useAppSelector((s) => s.wallet);
  const error = homeError ?? walletError;

  const loadDashboard = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(fetchDashboardThunk()).unwrap(),
        dispatch(fetchBalanceThunk()).unwrap(),
      ]);
    } catch {
      /* Rejected thunks already wrote slice errors. */
    }
  }, [dispatch]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    user,
    balance,
    recentTransactions,
    loading: walletLoading || homeLoading,
    error,
    refresh: loadDashboard,
  };
}
