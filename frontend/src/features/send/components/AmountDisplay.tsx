interface AmountDisplayProps {
  value: string;
  error?: string | null;
}

export function AmountDisplay({ value, error }: AmountDisplayProps) {
  const displayValue = value || "0";

  return (
    <div className="flex flex-col items-center py-6">
      <div className="flex items-baseline text-primary">
        <span className="text-3xl font-bold mr-1">₹</span>
        <span className="text-7xl font-extrabold tracking-tighter">
          {displayValue}
        </span>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-1.5 bg-error-container px-3 py-1.5 rounded-full">
          <span
            className="material-symbols-outlined text-on-error-container text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            error
          </span>
          <span className="text-on-error-container text-xs font-semibold">
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
