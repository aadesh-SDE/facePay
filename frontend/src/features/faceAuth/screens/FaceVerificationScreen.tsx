import { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFaceViewModel } from "../viewModel/useFaceViewModel";
import { FaceScanner } from "../components/FaceScanner";
import { Icon } from "@/shared/components/ui/Icon";
import type { VerifyStatus } from "../types/face.types";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { submitTransferThunk } from "@/features/send/state/sendThunks";

export function FaceVerificationScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const send = useSelector((state: RootState) => state.send);
  const {
    descriptor,
    blinkCount,
    updateStatus,
    addBlink,
    addAttempt,
    resetVerify,
    loadDescriptor,
    registered,
  } = useFaceViewModel();

  const loadedRef = useRef(false);

  useEffect(() => {
    if (!registered && !loadedRef.current) {
      loadedRef.current = true;
      loadDescriptor();
    }
  }, [registered, loadDescriptor]);

  const handleVerificationComplete = useCallback(
    async (success: boolean) => {
      if (success) {
        updateStatus("success");
        if (send.recipient && send.amount > 0) {
          try {
            await dispatch(
              submitTransferThunk({
                recipientId: send.recipient.id,
                amount: send.amount,
                note: send.note || undefined,
              }),
            ).unwrap();
            setTimeout(() => navigate("/send/success"), 1200);
          } catch {
            setTimeout(() => navigate("/send/review"), 1200);
          }
        } else {
          setTimeout(() => navigate("/send"), 800);
        }
      } else {
        addAttempt();
        navigate("/send/verify/failed");
      }
    },
    [navigate, updateStatus, addAttempt, dispatch, send.recipient, send.amount, send.note],
  );

  const handleStatusChange = useCallback(
    (status: VerifyStatus) => {
      updateStatus(status);
    },
    [updateStatus],
  );

  const handleBlinkCountChange = useCallback(
    (count: number) => {
      if (count > blinkCount) addBlink();
    },
    [blinkCount, addBlink],
  );

  useEffect(() => {
    resetVerify();
  }, [resetVerify]);

  return (
    <div className="min-h-screen bg-on-surface relative flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/10 backdrop-blur-xl flex justify-between items-center px-6 h-16">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <h1 className="font-headline font-extrabold text-white tracking-tighter text-lg">
          FacePay
        </h1>
        <div className="w-10" />
      </header>

      {/* Live indicator */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 bg-error/10 backdrop-blur-md rounded-full border border-error/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-error animate-ping" />
          <span className="text-white font-bold text-[10px] tracking-widest uppercase">
            Live
          </span>
        </div>
      </div>

      {/* Main scanning area */}
      <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-32 px-6">
        <FaceScanner
          mode="verify"
          storedDescriptor={descriptor}
          onVerificationComplete={handleVerificationComplete}
          onStatusChange={handleStatusChange}
          onBlinkCountChange={handleBlinkCountChange}
        />
      </main>

      {/* Bottom fallback action */}
      <div className="fixed bottom-8 left-0 w-full z-40 px-8">
        <button
          onClick={() => navigate(-1)}
          className="w-full h-14 bg-surface-container-low/20 backdrop-blur-lg border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-bold transition-all active:scale-95"
        >
          <Icon name="help_center" size="sm" className="text-white" />
          <span className="text-sm">Having trouble?</span>
        </button>
      </div>
    </div>
  );
}
