interface SettingsRowProps {
  icon: string;
  label: string;
  variant?: "default" | "danger";
  onClick?: () => void;
}

export function SettingsRow({
  icon,
  label,
  variant = "default",
  onClick,
}: SettingsRowProps) {
  const isDanger = variant === "danger";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 transition-all active:scale-[0.98] group ${
        isDanger ? "" : "border-t border-outline-variant/10"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          isDanger
            ? "bg-error-container/30 text-error"
            : "bg-surface-container-high text-on-surface-variant group-hover:bg-primary group-hover:text-white"
        }`}
      >
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <span
        className={`flex-1 text-left font-semibold ${
          isDanger ? "text-error font-bold" : "text-on-surface"
        }`}
      >
        {label}
      </span>
      <span className="material-symbols-outlined text-outline-variant">
        chevron_right
      </span>
    </button>
  );
}
