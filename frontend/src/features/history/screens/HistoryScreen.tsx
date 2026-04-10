import { useHistoryViewModel } from "../viewModel/useHistoryViewModel";
import { FilterChips } from "../components/FilterChips";
import { DateGroupHeader } from "../components/DateGroupHeader";
import { TransactionRow } from "../components/TransactionRow";
import { PageShell } from "@/shared/components/layout/PageShell";

export function HistoryScreen() {
  const {
    filter,
    searchQuery,
    loading,
    dateGroups,
    updateFilter,
    updateSearch,
  } = useHistoryViewModel();

  return (
    <PageShell topBarTitle="Transaction History" showBack bottomNav>
      <div className="px-6 pt-4 pb-24 max-w-md mx-auto space-y-5">
        {/* Filters */}
        <FilterChips active={filter} onChange={updateFilter} />

        {/* Search */}
        <div className="bg-surface-container-lowest rounded-xl shadow-soft p-1">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:ring-0 text-on-surface text-sm placeholder:text-outline"
              placeholder="Search transactions"
              value={searchQuery}
              onChange={(e) => updateSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Transactions */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-surface-container-lowest rounded-xl p-4 flex items-center gap-4 animate-pulse"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container-high" />
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-4 bg-surface-container-high rounded" />
                  <div className="w-20 h-3 bg-surface-container-high rounded" />
                </div>
                <div className="w-16 h-4 bg-surface-container-high rounded" />
              </div>
            ))}
          </div>
        ) : dateGroups.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-outline mb-3">
              receipt_long
            </span>
            <p className="text-on-surface font-bold mb-1">No transactions</p>
            <p className="text-on-surface-variant text-sm">
              {searchQuery
                ? "No results match your search"
                : "Your transaction history will appear here"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {dateGroups.map((group) => (
              <div key={group.label} className="space-y-2">
                <DateGroupHeader label={group.label} />
                <div className="space-y-2">
                  {group.transactions.map((tx) => (
                    <TransactionRow key={tx.id} transaction={tx} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
