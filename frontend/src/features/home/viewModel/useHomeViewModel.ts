import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { fetchDashboardThunk } from "../state/homeThunks";
import { fetchBalanceThunk } from "@/features/wallet/state/walletThunks";

export function useHomeViewModel() {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);
  const { balance, loading: walletLoading } = useSelector(
    (state: RootState) => state.wallet,
  );
  const { recentTransactions, loading: homeLoading, error } = useSelector(
    (state: RootState) => state.home,
  );

  const loadDashboard = useCallback(() => {
    dispatch(fetchDashboardThunk());
    dispatch(fetchBalanceThunk());
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
