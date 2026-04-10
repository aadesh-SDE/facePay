import type {
  SaveDescriptorRequest,
  SaveDescriptorResponse,
  GetDescriptorResponse,
} from "../types/face.types";

const MOCK_DELAY = 500;
const STORAGE_KEY = "fp_face_descriptor";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function saveFaceDescriptor(
  req: SaveDescriptorRequest,
): Promise<SaveDescriptorResponse> {
  await delay(MOCK_DELAY);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ userId: req.userId, descriptor: req.descriptor }),
  );
  return { success: true };
}

export async function getFaceDescriptor(
  userId: string,
): Promise<GetDescriptorResponse> {
  await delay(MOCK_DELAY);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return { descriptor: null };

  const data = JSON.parse(stored) as { userId: string; descriptor: number[] };
  if (data.userId !== userId) return { descriptor: null };

  return { descriptor: data.descriptor };
}

export async function deleteFaceDescriptor(): Promise<void> {
  await delay(MOCK_DELAY);
  localStorage.removeItem(STORAGE_KEY);
}
