import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFaceViewModel } from "../viewModel/useFaceViewModel";
import { FaceScanner } from "../components/FaceScanner";
import { Button } from "@/shared/components/ui/Button";
import { Icon } from "@/shared/components/ui/Icon";
import type { VerifyStatus } from "../types/face.types";

type Phase = "intro" | "scanning" | "complete";

export function RegisterFaceScreen() {
  const navigate = useNavigate();
  const { registerFace, error } = useFaceViewModel();
  const [phase, setPhase] = useState<Phase>("intro");
  const [saving, setSaving] = useState(false);

  const handleDescriptorCaptured = useCallback(
    async (descriptor: number[]) => {
      setSaving(true);
      const result = await registerFace(descriptor);
      setSaving(false);
      if (
        (result as { meta?: { requestStatus?: string } })?.meta?.requestStatus === "fulfilled"
      ) {
        setPhase("complete");
        setTimeout(() => navigate("/"), 1500);
      }
    },
    [registerFace, navigate],
  );

  const handleStatusChange = useCallback((status: VerifyStatus) => {
    if (status === "failed") {
      setPhase("intro");
    }
  }, []);

  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl flex justify-between items-center px-6 h-16">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <span className="material-symbols-outlined text-teal-900">arrow_back</span>
          </button>
          <h1 className="font-headline font-bold text-lg tracking-tight text-teal-900">
            Register Your Face
          </h1>
          <div className="w-10" />
        </header>

        <main className="flex-grow pt-16 pb-12 flex flex-col items-center px-6">
          {/* Instructions */}
          <div className="w-full max-w-md mt-6 mb-8 text-center">
            <h2 className="text-2xl font-headline font-extrabold text-primary mb-2">
              Center your face in the frame
            </h2>
            <p className="text-on-surface-variant text-sm px-4">
              Adjust your position until the frame turns green. Ensure your
              entire face is visible.
            </p>
          </div>

          {/* Scanner preview placeholder */}
          <div className="relative w-full aspect-square max-w-[320px] mb-10">
            <div className="absolute inset-0 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center">
              <Icon
                name="face"
                size="xl"
                className="text-outline opacity-30"
                filled
              />
            </div>
            {/* Corner brackets */}
            <div className="absolute inset-0 rounded-full border-[6px] border-primary-fixed-dim/40" />
            <div className="absolute top-10 left-10 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
            <div className="absolute top-10 right-10 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
            <div className="absolute bottom-10 left-10 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
            <div className="absolute bottom-10 right-10 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
          </div>

          {/* Tips */}
          <div className="w-full max-w-md grid grid-cols-2 gap-3 mb-10">
            <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary mb-2">
                light_mode
              </span>
              <span className="text-xs font-bold text-on-surface leading-tight">
                Find a well-lit area
              </span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary mb-2">
                visibility_off
              </span>
              <span className="text-xs font-bold text-on-surface leading-tight">
                Remove glasses/mask
              </span>
            </div>
          </div>

          {/* Privacy + Progress */}
          <div className="w-full max-w-md mt-auto">
            <div className="flex items-center justify-center gap-2 mb-6 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span className="text-[11px] font-medium tracking-wide">
                Face data processed locally for demo
              </span>
            </div>

            <div className="w-full bg-surface-container-high h-1.5 rounded-full mb-8 overflow-hidden">
              <div className="bg-primary h-full w-1/3 rounded-full" />
            </div>

            {error && (
              <div className="mb-4 bg-error-container/50 text-on-error-container text-sm font-medium px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <Button fullWidth onClick={() => setPhase("scanning")}>
              Start Scan
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (phase === "scanning") {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <header className="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl flex justify-between items-center px-6 h-16">
          <button
            onClick={() => setPhase("intro")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <span className="material-symbols-outlined text-teal-900">arrow_back</span>
          </button>
          <h1 className="font-headline font-bold text-lg tracking-tight text-teal-900">
            Register Your Face
          </h1>
          <div className="w-10" />
        </header>

        <main className="flex-grow pt-24 pb-12 flex flex-col items-center px-6 justify-center">
          {/* Live indicator */}
          <div className="mb-6 px-4 py-1.5 bg-error/10 backdrop-blur-md rounded-full border border-error/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-error animate-ping" />
              <span className="text-on-background font-bold text-[10px] tracking-widest uppercase">
                Live
              </span>
            </div>
          </div>

          <FaceScanner
            mode="register"
            onDescriptorCaptured={handleDescriptorCaptured}
            onStatusChange={handleStatusChange}
          />

          {saving && (
            <div className="mt-4 text-on-surface-variant text-sm font-medium animate-pulse">
              Saving face data...
            </div>
          )}

          {/* Privacy microcopy */}
          <div className="mt-8 flex items-center gap-2 text-on-surface-variant">
            <Icon name="verified_user" filled size="sm" className="text-teal-600" />
            <p className="text-[11px] font-medium tracking-wide uppercase">
              Biometric data is encrypted and never shared
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Complete phase
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-8">
      <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center mb-8 shadow-lg">
        <span
          className="material-symbols-outlined text-on-secondary-container text-4xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
      </div>
      <h1 className="text-2xl font-extrabold text-on-surface mb-2">
        Face Registered!
      </h1>
      <p className="text-on-surface-variant text-center">
        Your face has been securely registered. Redirecting to home...
      </p>
    </div>
  );
}
