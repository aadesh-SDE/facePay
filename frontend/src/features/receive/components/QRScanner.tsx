import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScan: (data: string) => void;
  active: boolean;
}

export function QRScanner({ onScan, active }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    if (!active) return;

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (!scannedRef.current) {
            scannedRef.current = true;
            onScan(decodedText);
            scanner.stop().catch(() => {});
          }
        },
        () => {},
      )
      .catch(() => {
        setError("Camera access denied or not available.");
      });

    return () => {
      scanner.stop().catch(() => {});
      scanner.clear();
    };
  }, [active, onScan]);

  return (
    <div className="relative">
      <div id="qr-reader" className="w-full rounded-2xl overflow-hidden" />
      {error && (
        <div className="mt-3 bg-error-container/50 text-on-error-container text-sm font-medium px-4 py-3 rounded-xl text-center">
          {error}
        </div>
      )}
    </div>
  );
}
