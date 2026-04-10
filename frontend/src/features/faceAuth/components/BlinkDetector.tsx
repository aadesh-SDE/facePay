interface BlinkDetectorProps {
  blinkCount: number;
  requiredBlinks: number;
  isActive: boolean;
}

export function BlinkDetector({
  blinkCount,
  requiredBlinks,
  isActive,
}: BlinkDetectorProps) {
  if (!isActive) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5">
        {Array.from({ length: requiredBlinks }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < blinkCount
                ? "bg-primary-fixed scale-110 shadow-sm shadow-primary-fixed/50"
                : "bg-white/20 border border-white/30"
            }`}
          />
        ))}
      </div>
      <span className="text-white/80 text-xs font-semibold">
        {blinkCount >= requiredBlinks
          ? "Blinks confirmed"
          : `Blink ${blinkCount}/${requiredBlinks}`}
      </span>
    </div>
  );
}
