/** Human-friendly subtitle for feed rows (client may replace with locale). */
export function formatTransactionSubtitle(iso: Date): string {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
