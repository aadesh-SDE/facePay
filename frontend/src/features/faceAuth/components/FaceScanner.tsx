import { useEffect, useRef, useCallback, useState } from "react";
import { useCamera } from "@/shared/hooks/useCamera";
import {
  loadFaceModels,
  detectFace,
  compareDescriptors,
  descriptorToArray,
  arrayToDescriptor,
} from "@/shared/services/faceService";
import { ScannerRing } from "./ScannerRing";
import type { VerifyStatus } from "../types/face.types";

interface FaceScannerProps {
  mode: "register" | "verify";
  storedDescriptor?: number[] | null;
  onDescriptorCaptured?: (descriptor: number[]) => void;
  onVerificationComplete?: (success: boolean) => void;
  onStatusChange?: (status: VerifyStatus) => void;
}

export function FaceScanner({
  mode,
  storedDescriptor,
  onDescriptorCaptured,
  onVerificationComplete,
  onStatusChange,
}: FaceScannerProps) {
  const { videoRef, error: cameraError, isActive, start, stop } = useCamera();
  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [feedback, setFeedback] = useState("Initializing...");
  const [modelsReady, setModelsReady] = useState(false);

  const animFrameRef = useRef<number>(0);
  const completedRef = useRef(false);

  const updateStatus = useCallback(
    (s: VerifyStatus) => {
      setStatus(s);
      onStatusChange?.(s);
    },
    [onStatusChange],
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
    return () => {
      cancelled = true;
    };
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

  // Verification: proceed on face match (no blink liveness)
  useEffect(() => {
    if (mode !== "verify" || !isActive || !modelsReady || completedRef.current) return;
    if (!storedDescriptor) {
      updateStatus("failed");
      setFeedback("No registered face found");
      return;
    }

    let running = true;

    async function detectLoop() {
      if (!running || !videoRef.current || completedRef.current) return;

      const result = await detectFace(videoRef.current);
      if (!running) return;

      if (!result) {
        setFeedback("No face detected. Look at the camera.");
        animFrameRef.current = requestAnimationFrame(() => {
          setTimeout(detectLoop, 200);
        });
        return;
      }

      const comparison = compareDescriptors(
        arrayToDescriptor(storedDescriptor!),
        result.descriptor,
      );

      if (comparison.match) {
        completedRef.current = true;
        updateStatus("success");
        setFeedback("Face matched! Processing payment...");
        onVerificationComplete?.(true);
        return;
      }

      setFeedback("Face not recognized. Adjust position.");
      animFrameRef.current = requestAnimationFrame(() => {
        setTimeout(detectLoop, 200);
      });
    }

    detectLoop();

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [
    mode,
    isActive,
    modelsReady,
    storedDescriptor,
    videoRef,
    updateStatus,
    onVerificationComplete,
  ]);

  useEffect(() => {
    return () => {
      stop();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [stop]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-72 h-72 flex items-center justify-center">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover rounded-full"
          playsInline
          muted
          style={{ transform: "scaleX(-1)" }}
        />

        <div className="absolute inset-0 z-10 bg-primary/30 backdrop-blur-[2px] biometric-overlay rounded-full" />

        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <ScannerRing status={status} size={288} />
        </div>
      </div>

      <div className="mt-8 w-full max-w-sm">
        <div className="bg-surface-container-lowest/80 backdrop-blur-md px-6 py-4 rounded-3xl shadow-whisper text-center">
          {(status === "scanning" || status === "loading_models") && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
              <p className="text-on-surface-variant font-semibold tracking-wide uppercase text-[10px]">
                {status === "loading_models" ? "Loading" : "Scanning in progress"}
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <span
                className="material-symbols-outlined text-secondary text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <p className="text-secondary font-semibold tracking-wide uppercase text-[10px]">
                Complete
              </p>
            </div>
          )}

          {status === "failed" && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <span
                className="material-symbols-outlined text-error text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                error
              </span>
              <p className="text-error font-semibold tracking-wide uppercase text-[10px]">
                Failed
              </p>
            </div>
          )}

          <h2 className="text-on-surface font-bold text-lg mb-1">{feedback}</h2>
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
