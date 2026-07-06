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
