import type { TransactionFilter } from "../types/history.types";

interface FilterChipsProps {
  active: TransactionFilter;
  onChange: (filter: TransactionFilter) => void;
}

const FILTERS: { value: TransactionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sent", label: "Sent" },
  { value: "received", label: "Received" },
];

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
            active === f.value
              ? "bg-primary-container text-on-primary-container shadow-sm"
              : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
