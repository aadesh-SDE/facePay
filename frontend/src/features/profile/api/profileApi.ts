import type { SecurityHealth } from "../types/profile.types";

const MOCK_DELAY = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchSecurityHealth(): Promise<SecurityHealth> {
  await delay(MOCK_DELAY);
  const faceRegistered = !!localStorage.getItem("fp_face_descriptor");
  return {
    score: faceRegistered ? 85 : 40,
    faceRegistered,
    emailVerified: true,
    pinEnabled: false,
  };
}
