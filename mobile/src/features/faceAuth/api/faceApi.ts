import { apiClient } from "@/shared/api/client";
import type {
  GetDescriptorResponse,
  SaveDescriptorRequest,
  SaveDescriptorResponse,
} from "@/features/faceAuth/types/face.types";

export async function saveFaceDescriptor(
  req: SaveDescriptorRequest,
): Promise<SaveDescriptorResponse> {
  void req.userId;
  await apiClient.put("/api/v1/me/face-template", { descriptor: req.descriptor });
  return { success: true };
}

export async function getFaceDescriptor(
  _userId: string,
): Promise<GetDescriptorResponse> {
  const { data } = await apiClient.get<GetDescriptorResponse>(
    "/api/v1/me/face-template",
  );
  return data;
}
