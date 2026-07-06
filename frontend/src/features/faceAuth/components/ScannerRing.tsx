import type { VerifyStatus } from "../types/face.types";

interface ScannerRingProps {
  status: VerifyStatus;
  size?: number;
}

const statusStyles: Record<VerifyStatus, { border: string; animate: boolean }> = {
  idle: { border: "border-outline-variant/40", animate: false },
  loading_models: { border: "border-primary-fixed-dim/40", animate: true },
  scanning: { border: "border-primary-fixed/60", animate: true },
  matched: { border: "border-primary-fixed", animate: true },
  success: { border: "border-secondary", animate: false },
  failed: { border: "border-error", animate: false },
};

export function ScannerRing({ status, size = 288 }: ScannerRingProps) {
  const { border, animate } = statusStyles[status];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className={`absolute inset-0 rounded-full border-2 ${border} transition-colors duration-500`} />

      {animate && (
        <div className="absolute inset-0 rounded-full scanning-ring" />
      )}

      <div className="absolute inset-3 flex items-center justify-center">
        <div
          className={`w-full h-full rounded-full border-2 border-dashed transition-colors duration-500 ${
            status === "failed" ? "border-error/50" : "border-primary-fixed/30"
          }`}
        />
      </div>

      <div
        className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-2xl transition-colors duration-300 ${
          status === "failed" ? "border-error" : "border-primary-fixed"
        }`}
      />
      <div
        className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-2xl transition-colors duration-300 ${
          status === "failed" ? "border-error" : "border-primary-fixed"
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-2xl transition-colors duration-300 ${
          status === "failed" ? "border-error" : "border-primary-fixed"
        }`}
      />
      <div
        className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-2xl transition-colors duration-300 ${
          status === "failed" ? "border-error" : "border-primary-fixed"
        }`}
      />
    </div>
  );
}
