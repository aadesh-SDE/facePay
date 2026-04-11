import api from "@/shared/services/api";
import type {
  SaveDescriptorRequest,
  SaveDescriptorResponse,
  GetDescriptorResponse,
} from "../types/face.types";

export async function saveFaceDescriptor(
  req: SaveDescriptorRequest,
): Promise<SaveDescriptorResponse> {
  void req.userId;
  await api.put("/api/v1/me/face-template", { descriptor: req.descriptor });
  return { success: true };
}

export async function getFaceDescriptor(
  _userId: string,
): Promise<GetDescriptorResponse> {
  const { data } = await api.get<GetDescriptorResponse>(
    "/api/v1/me/face-template",
  );
  return data;
}

export async function deleteFaceDescriptor(): Promise<void> {
  await api.delete("/api/v1/me/face-template");
}
