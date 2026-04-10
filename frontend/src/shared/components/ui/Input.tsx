import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, rightElement, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-[10px] font-extrabold tracking-[0.15em] text-outline px-1 uppercase">
          {label}
        </label>
        <div
          className={`relative flex items-center bg-surface-container-highest rounded-xl px-4 h-14 group focus-within:ring-2 focus-within:ring-primary/20 transition-all ${error ? "ring-2 ring-error/40" : ""}`}
        >
          {icon && (
            <span className="material-symbols-outlined text-outline mr-3 text-xl" aria-hidden="true">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`bg-transparent border-none focus:ring-0 w-full text-on-surface font-semibold placeholder:text-outline-variant text-sm ${className}`}
            {...props}
          />
          {rightElement}
        </div>
        {error && (
          <p role="alert" className="text-error text-xs font-medium px-1">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
