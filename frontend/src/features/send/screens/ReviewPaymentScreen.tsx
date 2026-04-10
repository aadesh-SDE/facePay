import { useNavigate } from "react-router-dom";
import { useSendViewModel } from "../viewModel/useSendViewModel";
import { ReviewSummary } from "../components/ReviewSummary";

export function ReviewPaymentScreen() {
  const navigate = useNavigate();
  const { recipient, amount, note, fee, balance, updateStatus } =
    useSendViewModel();

  if (!recipient || amount <= 0) {
    navigate("/send", { replace: true });
    return null;
  }

  function handlePay() {
    updateStatus("verifying");
    navigate("/send/verify");
  }

  function handleCancel() {
    navigate("/send", { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-surface">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-surface/70 backdrop-blur-xl max-w-[390px]">
        <div className="flex items-center justify-between px-6 h-16">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <span className="material-symbols-outlined text-teal-900">
              arrow_back
            </span>
          </button>
          <h1 className="font-headline font-bold text-lg tracking-tight text-teal-900">
            Review Payment
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <main className="w-full max-w-[390px] px-6 pt-4 pb-44">
        <ReviewSummary
          recipient={recipient}
          amount={amount}
          note={note}
          fee={fee}
          balance={balance}
        />
      </main>

      {/* Fixed bottom actions */}
      <div className="fixed bottom-0 w-full max-w-[390px] p-6 z-40 bg-gradient-to-t from-surface via-surface/90 to-transparent">
        <button
          onClick={handlePay}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary text-lg font-bold rounded-xl py-4 shadow-glow active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            face_retouching_natural
          </span>
          Pay with FaceID
        </button>
        <button
          onClick={handleCancel}
          className="w-full mt-3 py-2 text-on-surface-variant font-medium text-sm hover:text-on-surface transition-colors active:scale-95"
        >
          Cancel Payment
        </button>
      </div>
    </div>
  );
}
