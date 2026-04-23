import { apiClient } from "@/shared/api/client";
import type { MeResponse, User } from "@/features/auth/types/auth.types";

function toUser(m: MeResponse): User {
  return {
    id: m.id,
    name: m.name,
    mobile: m.mobile,
    email: m.email,
    ...(m.avatar ? { avatar: m.avatar } : {}),
  };
}

export async function fetchMeApi(): Promise<User> {
  const { data } = await apiClient.get<MeResponse>("/api/v1/me");
  return toUser(data);
}
