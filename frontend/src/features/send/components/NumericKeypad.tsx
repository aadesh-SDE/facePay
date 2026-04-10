interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
}

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "backspace"],
];

export function NumericKeypad({ onKeyPress, onBackspace }: NumericKeypadProps) {
  return (
    <div className="bg-surface-container-low/80 backdrop-blur-2xl rounded-t-[2.5rem] pt-6 px-4 pb-6 shadow-[0_-12px_40px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-3 gap-[1px]">
        {KEYS.flat().map((key) => {
          if (key === "backspace") {
            return (
              <button
                key={key}
                onClick={onBackspace}
                className="h-16 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-colors active:scale-90"
              >
                <span className="material-symbols-outlined text-primary text-2xl">
                  backspace
                </span>
              </button>
            );
          }

          return (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className="h-16 flex items-center justify-center rounded-xl text-2xl font-semibold text-on-surface hover:bg-surface-container-high transition-colors active:scale-90"
            >
              {key}
            </button>
          );
        })}
      </div>
    </div>
  );
}
