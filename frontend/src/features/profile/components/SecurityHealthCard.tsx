import type { SecurityHealth } from "../types/profile.types";

interface SecurityHealthCardProps {
  health: SecurityHealth;
}

export function SecurityHealthCard({ health }: SecurityHealthCardProps) {
  return (
    <div className="relative overflow-hidden bg-primary-container text-on-primary-container rounded-xl p-6 shadow-sm">
      {/* Decorative blur */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-teal-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-xl">security</span>
          <span className="text-xs font-bold uppercase tracking-widest opacity-80">
            Security Health
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/20 h-2 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-teal-200 rounded-full transition-all duration-500"
            style={{ width: `${health.score}%` }}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-bold">{health.score}% Secure</span>
          <span className="text-xs opacity-70">
            {health.score >= 80 ? "Strong" : health.score >= 50 ? "Fair" : "Weak"}
          </span>
        </div>
      </div>
    </div>
  );
}
