import { apiClient } from "@/shared/api/client";
import type { SecurityHealth } from "@/features/profile/types/profile.types";

export type MeProfileResponse = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  joinedAt: string;
  faceRegistered: boolean;
  avatar?: string;
};

export async function fetchSecurityHealth(): Promise<SecurityHealth> {
  const { data } = await apiClient.get<SecurityHealth>(
    "/api/v1/me/security-summary",
  );
  return data;
}

export async function fetchMeProfile(): Promise<MeProfileResponse> {
  const { data } = await apiClient.get<MeProfileResponse>("/api/v1/me");
  return data;
}
