import { type InputHTMLAttributes, forwardRef, useState } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
  error?: string;
  isPassword?: boolean;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon, error, isPassword = false, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="group">
        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">
          {label}
        </label>
        <div
          className={`relative flex items-center bg-surface-container-highest rounded-xl px-4 h-14 focus-within:ring-2 focus-within:ring-primary/40 transition-all ${error ? "ring-2 ring-error/40" : ""}`}
        >
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
            {icon}
          </span>
          <input
            ref={ref}
            className={`w-full pl-8 pr-4 py-4 bg-transparent border-none focus:ring-0 text-on-surface font-semibold placeholder:text-outline text-sm ${className}`}
            type={isPassword ? (showPassword ? "text" : "password") : props.type}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined">
                {showPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          )}
        </div>
        {error && (
          <p className="text-error text-xs font-medium px-1 mt-1">{error}</p>
        )}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";
