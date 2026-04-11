import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSendViewModel } from "../viewModel/useSendViewModel";
import { RecipientCard } from "../components/RecipientCard";
import { AmountDisplay } from "../components/AmountDisplay";
import { NumericKeypad } from "../components/NumericKeypad";
import { isValidAmount, MAX_TRANSFER_RUPEES } from "@/shared/utils/validators";

export function EnterAmountScreen() {
  const navigate = useNavigate();
  const { recipient, balance, updateAmount, updateNote } = useSendViewModel();
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");

  const numericValue = parseFloat(value) || 0;
  const amountError = numericValue > 0 ? isValidAmount(numericValue, balance) : null;

  const handleKeyPress = useCallback((key: string) => {
    setValue((prev) => {
      if (key === "." && prev.includes(".")) return prev;
      if (key === "." && prev === "") return "0.";
      const next = prev + key;
      const parts = next.split(".");
      if (parts[1] && parts[1].length > 2) return prev;
      if (parseFloat(next) > MAX_TRANSFER_RUPEES) return prev;
      return next;
    });
  }, []);

  const handleBackspace = useCallback(() => {
    setValue((prev) => prev.slice(0, -1));
  }, []);

  function handleReview() {
    if (numericValue <= 0 || amountError) return;
    updateAmount(numericValue);
    updateNote(note);
    navigate("/send/review");
  }

  if (!recipient) {
    navigate("/send", { replace: true });
    return null;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl flex items-center justify-between px-6 h-16">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors"
        >
          <span className="material-symbols-outlined text-teal-900">
            arrow_back
          </span>
        </button>
        <span className="font-headline font-extrabold text-teal-800 tracking-tighter text-lg">
          FacePay
        </span>
        <div className="w-10" />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col pt-20 pb-4 px-6 max-w-md mx-auto w-full">
        <RecipientCard recipient={recipient} compact />

        <div className="flex-1 flex flex-col items-center justify-center">
          <AmountDisplay value={value} error={amountError} />
        </div>

        {/* Note */}
        <div className="flex justify-center mb-4">
          <input
            className="max-w-xs w-full bg-surface-container-low rounded-xl py-3 px-4 text-center text-sm text-on-surface placeholder:text-outline border-none focus:ring-2 focus:ring-primary/40"
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={50}
          />
        </div>

        {/* Review CTA */}
        <button
          onClick={handleReview}
          disabled={numericValue <= 0 || !!amountError}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-xl py-4 shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mb-2"
        >
          Review Payment
          <span className="material-symbols-outlined text-xl">
            chevron_right
          </span>
        </button>
      </main>

      {/* Keypad */}
      <NumericKeypad onKeyPress={handleKeyPress} onBackspace={handleBackspace} />
    </div>
  );
}
