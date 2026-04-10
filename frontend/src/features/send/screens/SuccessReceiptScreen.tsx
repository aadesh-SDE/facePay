import { useNavigate } from "react-router-dom";
import { useSendViewModel } from "../viewModel/useSendViewModel";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { Avatar } from "@/shared/components/ui/Avatar";

export function SuccessReceiptScreen() {
  const navigate = useNavigate();
  const { recipient, amount, note, transactionId, reset } = useSendViewModel();

  function handleDone() {
    reset();
    navigate("/", { replace: true });
  }

  if (!recipient) {
    navigate("/", { replace: true });
    return null;
  }

  const timestamp = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl flex items-center justify-between px-6 h-16">
        <span className="font-headline font-extrabold text-teal-800 tracking-tighter text-lg">
          FacePay
        </span>
        <div className="flex items-center gap-1.5 bg-secondary-container px-3 py-1 rounded-full">
          <span
            className="material-symbols-outlined text-on-secondary-container text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          <span className="text-on-secondary-container text-[10px] font-bold uppercase tracking-wider">
            Secure
          </span>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-md mx-auto flex-1 flex flex-col items-center">
        {/* Success icon with glow */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary-fixed blur-2xl opacity-30 animate-pulse rounded-full scale-150" />
          <div className="relative w-20 h-20 bg-primary-container rounded-full flex items-center justify-center">
            <span
              className="material-symbols-outlined text-on-primary-container text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
        </div>

        {/* Amount */}
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-1">
          {formatCurrency(amount)}
        </h1>
        <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-8">
          Sent Successfully
        </p>

        {/* Receipt card */}
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-whisper border border-outline-variant/10 overflow-hidden">
          {/* Top accent */}
          <div className="h-1 bg-login-gradient" />

          <div className="p-6 space-y-5">
            {/* Recipient */}
            <div className="flex items-center gap-4">
              <Avatar name={recipient.name} src={recipient.avatar} size="md" />
              <div>
                <p className="font-bold text-on-surface">{recipient.name}</p>
                <p className="text-xs text-on-surface-variant">Recipient</p>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-outline-variant/30">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Amount
                </p>
                <p className="text-sm font-bold text-on-surface">
                  {formatCurrency(amount)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Fee
                </p>
                <p className="text-sm font-bold text-secondary">Free</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Date
                </p>
                <p className="text-sm font-bold text-on-surface">{timestamp}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Status
                </p>
                <p className="text-sm font-bold text-primary">Completed</p>
              </div>
            </div>

            {note && (
              <div className="pt-4 border-t border-dashed border-outline-variant/30">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                  Note
                </p>
                <p className="text-sm text-on-surface">{note}</p>
              </div>
            )}

            {/* Transaction ID */}
            <div className="bg-surface-container-low rounded-lg p-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                account_balance
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Transaction ID
                </p>
                <p className="text-xs font-mono text-on-surface truncate">
                  {transactionId || "—"}
                </p>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-lg">
                info
              </span>
            </div>
          </div>

          {/* Perforated edge */}
          <div className="flex justify-between px-2 -mb-2">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-surface -translate-y-1.5"
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="w-full mt-8 space-y-3">
          <button
            onClick={handleDone}
            className="w-full h-14 bg-login-gradient text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            Done
          </button>
          <button className="w-full h-14 bg-surface-container-high text-on-surface font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-xl">share</span>
            Share Receipt
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-on-surface-variant text-center">
          Need help?{" "}
          <span className="text-primary font-semibold">Contact Support</span>
        </p>
      </main>
    </div>
  );
}
