import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useReceiveViewModel } from "../viewModel/useReceiveViewModel";
import { QRScanner } from "../components/QRScanner";

export function ScanQRScreen() {
  const navigate = useNavigate();
  const { handleScan, scanResult } = useReceiveViewModel();

  const onScan = useCallback(
    (data: string) => {
      handleScan(data);
    },
    [handleScan],
  );

  if (scanResult?.success && scanResult.data) {
    navigate("/send", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl flex items-center justify-between px-6 h-16">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors"
        >
          <span className="material-symbols-outlined text-teal-900">
            arrow_back
          </span>
        </button>
        <h1 className="font-headline font-bold text-lg tracking-tight text-teal-900">
          Scan QR
        </h1>
        <span className="font-headline font-extrabold text-teal-800 tracking-tighter text-sm">
          FacePay
        </span>
      </header>

      {/* Scanner */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-32 px-6">
        <div className="w-full max-w-[300px] relative">
          {/* Corner brackets */}
          <div className="absolute -top-3 -left-3 w-10 h-10 border-t-4 border-l-4 border-primary-fixed rounded-tl-2xl z-10" />
          <div className="absolute -top-3 -right-3 w-10 h-10 border-t-4 border-r-4 border-primary-fixed rounded-tr-2xl z-10" />
          <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-4 border-l-4 border-primary-fixed rounded-bl-2xl z-10" />
          <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-4 border-r-4 border-primary-fixed rounded-br-2xl z-10" />

          <QRScanner onScan={onScan} active />
        </div>

        {/* Info card */}
        <div className="mt-8 w-full max-w-sm bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl text-center">
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Point your camera at a FacePay QR code to start a payment
          </p>
          <button
            onClick={() => navigate("/send")}
            className="mt-3 text-primary font-bold text-sm tracking-wide hover:underline"
          >
            Or enter mobile number
          </button>
        </div>

        {scanResult && !scanResult.success && (
          <div className="mt-4 bg-error-container/80 text-on-error-container text-sm font-medium px-4 py-3 rounded-xl text-center max-w-sm">
            {scanResult.error}
          </div>
        )}
      </main>

      {/* Footer */}
      <div className="fixed bottom-8 left-0 w-full z-40 flex flex-col items-center gap-4 px-8">
        <button className="px-6 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">help</span>
          Need help scanning?
        </button>
        <div className="w-32 h-1.5 bg-white/30 rounded-full" />
      </div>
    </div>
  );
}
