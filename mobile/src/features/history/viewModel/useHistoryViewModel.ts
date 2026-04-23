import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchTransactionsThunk } from "@/features/history/state/historyThunks";
import { setFilter, setSearchQuery } from "@/features/history/state/historySlice";
import type { Transaction } from "@/features/home/types/home.types";

function matchesSearch(t: Transaction, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  return (
    t.title.toLowerCase().includes(s) ||
    t.subtitle.toLowerCase().includes(s)
  );
}

export function useHistoryViewModel() {
  const dispatch = useAppDispatch();
  const { transactions, filter, searchQuery, loading, error } = useAppSelector(
    (s) => s.history,
  );

  const load = useCallback(() => {
    void dispatch(fetchTransactionsThunk());
  }, [dispatch]);

  const refresh = useCallback(async () => {
    try {
      await dispatch(fetchTransactionsThunk()).unwrap();
    } catch {
      /* slice stores error */
    }
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    return transactions
      .filter((t) => {
        if (filter === "all") return true;
        return t.direction === filter;
      })
      .filter((t) => matchesSearch(t, searchQuery));
  }, [transactions, filter, searchQuery]);

  return {
    transactions: visible,
    filter,
    searchQuery,
    loading,
    error,
    setFilter: (f: typeof filter) => dispatch(setFilter(f)),
    setSearchQuery: (q: string) => dispatch(setSearchQuery(q)),
    refresh,
  };
}
