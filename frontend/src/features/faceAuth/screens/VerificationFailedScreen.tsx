import { useNavigate } from "react-router-dom";
import { useFaceViewModel } from "../viewModel/useFaceViewModel";
import { Button } from "@/shared/components/ui/Button";

export function VerificationFailedScreen() {
  const navigate = useNavigate();
  const { attempts, maxAttempts, isMaxAttempts, resetVerify } = useFaceViewModel();

  function handleTryAgain() {
    resetVerify();
    navigate("/send/verify", { replace: true });
  }

  function handleCancel() {
    resetVerify();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-on-surface relative flex flex-col items-center justify-center overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white/20 transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-white">arrow_back</span>
        </button>
        <h1 className="font-headline text-lg font-semibold tracking-tight text-white">
          FacePay
        </h1>
        <div className="w-10" />
      </header>

      {/* Error scanner frame */}
      <div className="relative w-[280px] h-[280px] mb-8">
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-error rounded-tl-3xl" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-error rounded-tr-3xl" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-error rounded-bl-3xl" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-error rounded-br-3xl" />
        <div className="absolute inset-4 rounded-full border-2 border-error/50 flex items-center justify-center">
          <div className="w-full h-full rounded-full border-4 border-error border-dashed opacity-80 scale-95" />
        </div>
      </div>

      {/* Feedback card */}
      <div className="w-full px-6 pb-12">
        <div className="bg-white/20 backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-2xl border border-white/20">
          {/* Error icon */}
          <div className="w-16 h-16 rounded-full bg-error flex items-center justify-center mb-6 shadow-lg shadow-error/20">
            <span
              className="material-symbols-outlined text-white text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              error
            </span>
          </div>

          {/* Attempt chip */}
          <div className="bg-error-container px-4 py-1.5 rounded-full mb-4">
            <span className="text-on-error-container text-[11px] font-bold tracking-wider uppercase">
              Attempt {attempts} of {maxAttempts}
            </span>
          </div>

          {/* Messaging */}
          <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight leading-tight">
            Verification Failed
          </h2>
          <p className="text-white/80 text-sm leading-relaxed max-w-[240px]">
            {isMaxAttempts
              ? "Maximum attempts reached. Please try again later."
              : "Face could not be matched. Please try again in good lighting."}
          </p>

          {/* Actions */}
          <div className="w-full mt-8 flex flex-col gap-4">
            {!isMaxAttempts && (
              <Button fullWidth onClick={handleTryAgain}>
                Try Again
              </Button>
            )}
            <button
              onClick={handleCancel}
              className="w-full py-2 text-white/90 font-medium text-sm hover:text-white transition-colors active:scale-95"
            >
              {isMaxAttempts ? "Go Home" : "Cancel Payment"}
            </button>
          </div>
        </div>

        {/* Privacy microcopy */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-white/50 text-xs">lock</span>
            <p className="text-white/50 text-[10px] font-medium tracking-wide">
              Biometric data is encrypted and never shared
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
