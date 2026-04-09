import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "surface" | "elevated" | "primary";
  onClick?: () => void;
}

const cardVariants = {
  surface: "bg-surface-container-lowest shadow-whisper",
  elevated: "bg-surface-container-lowest shadow-elevated",
  primary: "bg-gradient-to-br from-primary-container to-primary text-on-primary",
};

export function Card({
  children,
  className = "",
  variant = "surface",
  onClick,
}: CardProps) {
  return (
    <div
      className={`rounded-xl p-4 ${cardVariants[variant]} ${onClick ? "cursor-pointer active:scale-[0.98] transition-transform" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
