import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import type { AddFundsRequest } from "../types/wallet.types";
import { fetchBalanceThunk, addFundsThunk } from "../state/walletThunks";
import { clearWalletError } from "../state/walletSlice";

export function useWalletViewModel() {
  const dispatch = useDispatch<AppDispatch>();
  const { balance, loading, error } = useSelector(
    (state: RootState) => state.wallet,
  );

  const loadBalance = useCallback(
    () => dispatch(fetchBalanceThunk()),
    [dispatch],
  );

  const addFunds = useCallback(
    (req: AddFundsRequest) => dispatch(addFundsThunk(req)),
    [dispatch],
  );

  const clearError = useCallback(
    () => dispatch(clearWalletError()),
    [dispatch],
  );

  return {
    balance,
    loading,
    error,
    loadBalance,
    addFunds,
    clearError,
  };
}
