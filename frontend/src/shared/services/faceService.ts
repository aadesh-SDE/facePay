import * as faceapi from "@vladmandic/face-api";

const MODEL_URL = "/models";

let modelsLoaded = false;

export async function loadFaceModels(): Promise<void> {
  if (modelsLoaded) return;
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);
  modelsLoaded = true;
}

export function areModelsLoaded(): boolean {
  return modelsLoaded;
}

export interface DetectionResult {
  descriptor: Float32Array;
  landmarks: faceapi.FaceLandmarks68;
  detection: faceapi.FaceDetection;
}

export async function detectFace(
  input: HTMLVideoElement | HTMLCanvasElement,
): Promise<DetectionResult | null> {
  const result = await faceapi
    .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!result) return null;

  return {
    descriptor: result.descriptor,
    landmarks: result.landmarks,
    detection: result.detection,
  };
}

export function compareDescriptors(
  stored: Float32Array,
  current: Float32Array,
  threshold = 0.6,
): { match: boolean; distance: number } {
  const distance = faceapi.euclideanDistance(
    Array.from(stored),
    Array.from(current),
  );
  return { match: distance < threshold, distance };
}

export function descriptorToArray(descriptor: Float32Array): number[] {
  return Array.from(descriptor);
}

export function arrayToDescriptor(arr: number[]): Float32Array {
  return new Float32Array(arr);
}

/**
 * Eye Aspect Ratio (EAR) for blink detection.
 * Uses 6 landmark points per eye from the 68-point model.
 *
 * Left eye:  points 36–41
 * Right eye: points 42–47
 *
 * EAR = (||p2-p6|| + ||p3-p5||) / (2 * ||p1-p4||)
 * Open eye ≈ 0.25–0.30, Closed eye ≈ 0.05
 */
function pointDistance(
  p1: faceapi.Point,
  p2: faceapi.Point,
): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function eyeAspectRatio(eyePoints: faceapi.Point[]): number {
  const vertical1 = pointDistance(eyePoints[1], eyePoints[5]);
  const vertical2 = pointDistance(eyePoints[2], eyePoints[4]);
  const horizontal = pointDistance(eyePoints[0], eyePoints[3]);
  return (vertical1 + vertical2) / (2.0 * horizontal);
}

export function calculateEAR(landmarks: faceapi.FaceLandmarks68): {
  left: number;
  right: number;
  average: number;
  min: number;
} {
  const positions = landmarks.positions;
  const leftEye = positions.slice(36, 42);
  const rightEye = positions.slice(42, 48);

  const leftEAR = eyeAspectRatio(leftEye);
  const rightEAR = eyeAspectRatio(rightEye);

  return {
    left: leftEAR,
    right: rightEAR,
    average: (leftEAR + rightEAR) / 2.0,
    /** Stricter of the two eyes — better blink sensitivity than averaging. */
    min: Math.min(leftEAR, rightEAR),
  };
}

/** Frames with EAR below this count as “eye closed” (raised vs 0.2 so blinks register more easily). */
const EAR_THRESHOLD = 0.26;
/** Only one closed frame needed before reopening (was 2; slow inference missed fast blinks). */
const EAR_CONSEC_FRAMES = 1;

export interface BlinkTracker {
  blinkCount: number;
  belowThresholdFrames: number;
  wasBelow: boolean;
}

export function createBlinkTracker(): BlinkTracker {
  return { blinkCount: 0, belowThresholdFrames: 0, wasBelow: false };
}

export function updateBlinkTracker(
  tracker: BlinkTracker,
  ear: number,
): BlinkTracker {
  const next = { ...tracker };

  if (ear < EAR_THRESHOLD) {
    next.belowThresholdFrames++;
    next.wasBelow = true;
  } else {
    if (next.wasBelow && next.belowThresholdFrames >= EAR_CONSEC_FRAMES) {
      next.blinkCount++;
    }
    next.belowThresholdFrames = 0;
    next.wasBelow = false;
  }

  return next;
}
