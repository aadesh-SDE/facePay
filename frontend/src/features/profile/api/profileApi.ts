import api from "@/shared/services/api";
import type { SecurityHealth } from "../types/profile.types";

export type MeResponse = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  joinedAt: string;
  faceRegistered: boolean;
  avatar?: string;
};

export async function fetchSecurityHealth(): Promise<SecurityHealth> {
  const { data } = await api.get<SecurityHealth>("/api/v1/me/security-summary");
  return data;
}

export async function fetchMeProfile(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>("/api/v1/me");
  return data;
}
