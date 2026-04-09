import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthViewModel } from "../viewModel/useAuthViewModel";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { BiometricHint } from "../components/BiometricHint";
import { Icon } from "@/shared/components/ui/Icon";

export function LoginScreen() {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthViewModel();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    const result = await login({ mobile, password });
    if (loginThunkFulfilled(result)) {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col overflow-x-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl">
        <div className="flex justify-between items-center px-6 h-16 w-full">
          <div className="flex items-center gap-4">
            <div className="w-10" />
            <span className="font-headline font-extrabold text-teal-800 tracking-tighter text-lg">
              FacePay
            </span>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="flex-1 pt-24 pb-12 px-8 flex flex-col relative">
        {/* Background decorations */}
        <div className="absolute top-20 -right-20 w-64 h-64 bg-secondary-container/10 blur-[80px] rounded-full -z-10" />
        <div className="absolute bottom-40 -left-20 w-72 h-72 bg-primary-container/10 blur-[100px] rounded-full -z-10" />

        {/* Hero */}
        <section className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-primary-container rounded-3xl flex items-center justify-center mb-8 shadow-lg">
            <Icon name="face" filled size="xl" className="text-on-primary-container" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">
            Welcome Back
          </h1>
          <p className="text-on-surface-variant font-medium">
            Login to your FacePay account
          </p>
        </section>

        {/* Form */}
        <form className="space-y-6 flex-1" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold tracking-[0.15em] text-outline px-1">
              MOBILE NUMBER
            </label>
            <div className="relative flex items-center bg-surface-container-highest rounded-xl px-4 h-14 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-outline mr-3 text-xl">
                phone
              </span>
              <span className="text-on-surface-variant font-bold mr-2 text-sm border-r border-outline-variant pr-2">
                +91
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 w-full text-on-surface font-semibold placeholder:text-outline-variant text-sm"
                placeholder="00000 00000"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
          </div>

          <Input
            label="Password"
            icon="lock"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            rightElement={
              <button
                type="button"
                className="text-outline hover:text-primary transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            }
          />

          <div className="flex justify-end">
            <a className="text-sm font-bold text-primary hover:opacity-80 transition-opacity" href="#">
              Forgot Password?
            </a>
          </div>

          {error && (
            <div className="bg-error-container/50 text-on-error-container text-sm font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              fullWidth
              icon="arrow_forward"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <footer className="mt-12 text-center pb-8">
          <p className="text-on-surface-variant font-medium text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-primary font-extrabold ml-1 hover:underline">
              Sign Up
            </Link>
          </p>
          <div className="mt-12">
            <BiometricHint />
          </div>
        </footer>
      </main>

      {/* Bottom decoration */}
      <div className="fixed bottom-0 right-0 w-32 h-32 bg-secondary/5 blur-[40px] rounded-full pointer-events-none" />
    </div>
  );
}

function loginThunkFulfilled(result: unknown): boolean {
  return (result as { meta?: { requestStatus?: string } })?.meta?.requestStatus === "fulfilled";
}
