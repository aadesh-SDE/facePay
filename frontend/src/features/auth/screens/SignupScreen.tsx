import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthViewModel } from "../viewModel/useAuthViewModel";
import { Button } from "@/shared/components/ui/Button";
import { Icon } from "@/shared/components/ui/Icon";
import { BiometricHint } from "../components/BiometricHint";
import {
  isValidName,
  isValidMobile,
  isValidEmail,
  isValidPassword,
} from "@/shared/utils/validators";

export function SignupScreen() {
  const navigate = useNavigate();
  const { signup, loading, error, clearError } = useAuthViewModel();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errors: Record<string, string> = {};
    const nameErr = isValidName(name);
    if (nameErr) errors.name = nameErr;
    if (!isValidMobile(mobile)) errors.mobile = "Enter a valid 10-digit mobile number";
    if (!isValidEmail(email)) errors.email = "Enter a valid email address";
    const passErr = isValidPassword(password);
    if (passErr) errors.password = passErr;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    const result = await signup({ name, mobile, email, password });
    if (
      (result as { meta?: { requestStatus?: string } })?.meta?.requestStatus ===
      "fulfilled"
    ) {
      navigate("/register-face");
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center overflow-x-hidden font-poppins">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl flex justify-between items-center px-6 h-16">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors"
        >
          <span className="material-symbols-outlined text-teal-900">
            arrow_back
          </span>
        </button>
        <span className="font-headline font-extrabold text-teal-800 tracking-tighter text-lg">
          FacePay
        </span>
        <div className="w-10" />
      </header>

      <main className="w-full max-w-md px-8 pt-24 pb-12 flex flex-col min-h-screen">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-container mb-6 shadow-xl shadow-primary/10">
            <Icon name="face" filled size="xl" className="text-on-primary-container" />
          </div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">
            Create your FacePay Account
          </h1>
          <p className="text-on-surface-variant text-sm px-4">
            Experience the future of secure, touchless digital payments.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="group">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">
              Full Name
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                person
              </span>
              <input
                className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline transition-all"
                placeholder="John Doe"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {fieldErrors.name && (
              <p className="text-error text-xs font-medium px-1 mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Mobile */}
          <div className="group">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">
              Mobile Number
            </label>
            <div className="flex gap-3">
              <div className="relative w-24">
                <input
                  className="w-full px-4 py-4 bg-surface-container-highest border-none rounded-xl text-on-surface font-medium cursor-default"
                  readOnly
                  type="text"
                  value="+91"
                />
              </div>
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  phone_iphone
                </span>
                <input
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline transition-all"
                  placeholder="98765 43210"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            </div>
            {fieldErrors.mobile && (
              <p className="text-error text-xs font-medium px-1 mt-1">{fieldErrors.mobile}</p>
            )}
          </div>

          {/* Email */}
          <div className="group">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                mail
              </span>
              <input
                className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline transition-all"
                placeholder="john@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-error text-xs font-medium px-1 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="group">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                lock
              </span>
              <input
                className={`w-full pl-12 pr-12 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline transition-all`}
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-error text-xs font-medium px-1 mt-1">{fieldErrors.password}</p>
            )}
          </div>
        </form>

        {/* Privacy */}
        <div className="mt-8 flex items-start gap-3 px-2">
          <div className="mt-0.5">
            <Icon name="verified_user" filled size="sm" className="text-teal-600" />
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Your data is encrypted and demo funds are not real money. By
            continuing, you agree to our{" "}
            <span className="text-primary font-medium">Terms of Service</span>.
          </p>
        </div>

        {error && (
          <div className="mt-4 bg-error-container/50 text-on-error-container text-sm font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-10">
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            onClick={(e) => handleSubmit(e as unknown as FormEvent)}
          >
            {loading ? "Creating Account..." : "Continue"}
          </Button>
          <p className="mt-6 text-center text-on-surface-variant text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline ml-1">
              Login
            </Link>
          </p>
        </div>

        {/* Biometric hint */}
        <div className="mt-12 opacity-40 grayscale">
          <BiometricHint />
        </div>
      </main>

      {/* Decorative blobs */}
      <div className="fixed -bottom-24 -right-24 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl -z-10" />
      <div className="fixed -top-12 -left-12 w-48 h-48 bg-primary-fixed/10 rounded-full blur-3xl -z-10" />
    </div>
  );
}
