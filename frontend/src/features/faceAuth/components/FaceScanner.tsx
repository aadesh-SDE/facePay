import { useEffect, useRef, useCallback, useState } from "react";
import { useCamera } from "@/shared/hooks/useCamera";
import {
  loadFaceModels,
  detectFace,
  calculateEAR,
  createBlinkTracker,
  updateBlinkTracker,
  compareDescriptors,
  descriptorToArray,
  arrayToDescriptor,
  type BlinkTracker,
} from "@/shared/services/faceService";
import { ScannerRing } from "./ScannerRing";
import { BlinkDetector } from "./BlinkDetector";
import type { VerifyStatus } from "../types/face.types";

interface FaceScannerProps {
  mode: "register" | "verify";
  storedDescriptor?: number[] | null;
  onDescriptorCaptured?: (descriptor: number[]) => void;
  onVerificationComplete?: (success: boolean) => void;
  onStatusChange?: (status: VerifyStatus) => void;
  onBlinkCountChange?: (count: number) => void;
  requiredBlinks?: number;
  blinkTimeoutSeconds?: number;
}

export function FaceScanner({
  mode,
  storedDescriptor,
  onDescriptorCaptured,
  onVerificationComplete,
  onStatusChange,
  onBlinkCountChange,
  requiredBlinks = 2,
  blinkTimeoutSeconds = 10,
}: FaceScannerProps) {
  const { videoRef, error: cameraError, isActive, start, stop } = useCamera();
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [blinkCount, setBlinkCount] = useState(0);
  const [feedback, setFeedback] = useState("Initializing...");
  const [modelsReady, setModelsReady] = useState(false);

  const animFrameRef = useRef<number>(0);
  const blinkTrackerRef = useRef<BlinkTracker>(createBlinkTracker());
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const completedRef = useRef(false);

  const updateStatus = useCallback(
    (s: VerifyStatus) => {
      setStatus(s);
      onStatusChange?.(s);
    },
    [onStatusChange],
  );

  const updateBlinks = useCallback(
    (count: number) => {
      setBlinkCount(count);
      onBlinkCountChange?.(count);
    },
    [onBlinkCountChange],
  );

  useEffect(() => {
    let cancelled = false;
    async function init() {
      updateStatus("loading_models");
      setFeedback("Loading face detection models...");
      try {
        await loadFaceModels();
        if (!cancelled) {
          setModelsReady(true);
          setFeedback("Models loaded. Starting camera...");
        }
      } catch {
        if (!cancelled) {
          updateStatus("failed");
          setFeedback("Failed to load face models. Please refresh.");
        }
      }
    }
    init();
    return () => { cancelled = true; };
  }, [updateStatus]);

  useEffect(() => {
    if (modelsReady && !isActive) {
      start();
    }
  }, [modelsReady, isActive, start]);

  useEffect(() => {
    if (!isActive || !modelsReady) return;
    updateStatus("scanning");
    setFeedback(
      mode === "register"
        ? "Center your face in the frame"
        : "Scanning your face...",
    );
  }, [isActive, modelsReady, mode, updateStatus]);

  // Registration detection loop
  useEffect(() => {
    if (mode !== "register" || !isActive || !modelsReady || completedRef.current) return;

    let running = true;

    async function detectLoop() {
      if (!running || !videoRef.current) return;

      const result = await detectFace(videoRef.current);
      if (!running) return;

      if (result) {
        const desc = descriptorToArray(result.descriptor);
        setFeedback("Face detected! Capturing...");
        updateStatus("success");
        completedRef.current = true;
        onDescriptorCaptured?.(desc);
        return;
      }

      setFeedback("Position your face in the center");
      animFrameRef.current = requestAnimationFrame(() => {
        setTimeout(detectLoop, 200);
      });
    }

    detectLoop();

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [mode, isActive, modelsReady, videoRef, updateStatus, onDescriptorCaptured]);

  // Verification detection loop
  useEffect(() => {
    if (mode !== "verify" || !isActive || !modelsReady || completedRef.current) return;
    if (!storedDescriptor) {
      updateStatus("failed");
      setFeedback("No registered face found");
      return;
    }

    let running = true;
    let matched = false;

    async function detectLoop() {
      if (!running || !videoRef.current) return;

      const result = await detectFace(videoRef.current);
      if (!running) return;

      if (!result) {
        setFeedback("No face detected. Look at the camera.");
        animFrameRef.current = requestAnimationFrame(() => {
          setTimeout(detectLoop, 200);
        });
        return;
      }

      if (!matched) {
        const comparison = compareDescriptors(
          arrayToDescriptor(storedDescriptor!),
          result.descriptor,
        );

        if (comparison.match) {
          matched = true;
          updateStatus("blink_pending");
          setFeedback("Face matched! Blink twice to confirm");
          blinkTrackerRef.current = createBlinkTracker();
          updateBlinks(0);

          blinkTimerRef.current = setTimeout(() => {
            if (running && !completedRef.current) {
              completedRef.current = true;
              updateStatus("failed");
              setFeedback("Blink timeout. Please try again.");
              onVerificationComplete?.(false);
            }
          }, blinkTimeoutSeconds * 1000);
        } else {
          setFeedback("Face not recognized. Adjust position.");
        }
      }

      if (matched && !completedRef.current) {
        const ear = calculateEAR(result.landmarks);
        blinkTrackerRef.current = updateBlinkTracker(
          blinkTrackerRef.current,
          ear.average,
        );
        const currentBlinks = blinkTrackerRef.current.blinkCount;
        updateBlinks(currentBlinks);

        if (currentBlinks >= requiredBlinks) {
          completedRef.current = true;
          clearTimeout(blinkTimerRef.current);
          updateStatus("success");
          setFeedback("Verification successful!");
          onVerificationComplete?.(true);
          return;
        }
      }

      animFrameRef.current = requestAnimationFrame(() => {
        setTimeout(detectLoop, 100);
      });
    }

    detectLoop();

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
      clearTimeout(blinkTimerRef.current);
    };
  }, [
    mode, isActive, modelsReady, storedDescriptor, videoRef,
    updateStatus, updateBlinks, onVerificationComplete,
    requiredBlinks, blinkTimeoutSeconds,
  ]);

  useEffect(() => {
    return () => {
      stop();
      cancelAnimationFrame(animFrameRef.current);
      clearTimeout(blinkTimerRef.current);
    };
  }, [stop]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Camera viewport */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover rounded-full"
          playsInline
          muted
          style={{ transform: "scaleX(-1)" }}
        />

        {/* Overlay scrim with cutout */}
        <div className="absolute inset-0 z-10 bg-primary/30 backdrop-blur-[2px] biometric-overlay rounded-full" />

        {/* Scanner ring */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <ScannerRing status={status} size={288} />
        </div>
      </div>

      {/* Feedback card */}
      <div className="mt-8 w-full max-w-sm">
        <div className="bg-surface-container-lowest/80 backdrop-blur-md px-6 py-4 rounded-3xl shadow-whisper text-center">
          {(status === "scanning" || status === "blink_pending" || status === "loading_models") && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
              <p className="text-on-surface-variant font-semibold tracking-wide uppercase text-[10px]">
                {status === "loading_models" ? "Loading" : "Scanning in progress"}
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <p className="text-secondary font-semibold tracking-wide uppercase text-[10px]">
                Complete
              </p>
            </div>
          )}

          {status === "failed" && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-error text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                error
              </span>
              <p className="text-error font-semibold tracking-wide uppercase text-[10px]">
                Failed
              </p>
            </div>
          )}

          <h2 className="text-on-surface font-bold text-lg mb-1">{feedback}</h2>

          {status === "blink_pending" && (
            <div className="mt-3 flex justify-center">
              <BlinkDetector
                blinkCount={blinkCount}
                requiredBlinks={requiredBlinks}
                isActive
              />
            </div>
          )}
        </div>

        {cameraError && (
          <div className="mt-3 bg-error-container/50 text-on-error-container text-sm font-medium px-4 py-3 rounded-xl text-center">
            {cameraError}
          </div>
        )}
      </div>
    </div>
  );
}
