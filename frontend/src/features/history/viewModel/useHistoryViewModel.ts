import { useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import type { TransactionFilter, DateGroup } from "../types/history.types";
import { fetchTransactionsThunk } from "../state/historyThunks";
import { setFilter, setSearchQuery } from "../state/historySlice";

function getDateLabel(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function useHistoryViewModel() {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, filter, searchQuery, loading, error } = useSelector(
    (state: RootState) => state.history,
  );

  const loadTransactions = useCallback(
    () => dispatch(fetchTransactionsThunk()),
    [dispatch],
  );

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const updateFilter = useCallback(
    (f: TransactionFilter) => dispatch(setFilter(f)),
    [dispatch],
  );

  const updateSearch = useCallback(
    (q: string) => dispatch(setSearchQuery(q)),
    [dispatch],
  );

  const filteredTransactions = useMemo(() => {
    let result = transactions;
    if (filter !== "all") {
      result = result.filter((t) => t.direction === filter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }
    return result;
  }, [transactions, filter, searchQuery]);

  const dateGroups = useMemo<DateGroup[]>(() => {
    const groups: Record<string, DateGroup> = {};
    for (const tx of filteredTransactions) {
      const label = getDateLabel(tx.timestamp);
      if (!groups[label]) groups[label] = { label, transactions: [] };
      groups[label].transactions.push(tx);
    }
    return Object.values(groups);
  }, [filteredTransactions]);

  return {
    filter,
    searchQuery,
    loading,
    error,
    dateGroups,
    totalCount: transactions.length,
    updateFilter,
    updateSearch,
    refresh: loadTransactions,
  };
}
