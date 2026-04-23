import { apiClient } from "@/shared/api/client";

export type HealthResponse = Record<string, unknown>;

export async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await apiClient.get<HealthResponse>("/health");
  return data;
}
