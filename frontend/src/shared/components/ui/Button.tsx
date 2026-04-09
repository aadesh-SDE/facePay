import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  children: ReactNode;
  icon?: string;
}

const variants = {
  primary:
    "bg-login-gradient text-on-primary font-bold shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98]",
  secondary:
    "bg-surface-container-high text-on-surface font-semibold hover:bg-surface-container-highest active:scale-[0.98]",
  ghost:
    "bg-transparent text-primary font-bold hover:bg-primary/5 active:scale-[0.98]",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  children,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`h-14 rounded-xl flex items-center justify-center gap-2 transition-all ${variants[variant]} ${fullWidth ? "w-full" : "px-6"} ${className}`}
      {...props}
    >
      {children}
      {icon && (
        <span className="material-symbols-outlined text-xl">{icon}</span>
      )}
    </button>
  );
}
