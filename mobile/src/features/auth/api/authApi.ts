import { apiClient } from "@/shared/api/client";
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
} from "@/features/auth/types/auth.types";

const BASE = "/api/v1/auth";

export async function loginApi(req: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(`${BASE}/login`, {
    mobile: req.mobile.replace(/\s/g, ""),
    password: req.password,
  });
  return data;
}

export async function signupApi(req: SignupRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(`${BASE}/signup`, {
    name: req.name.trim(),
    mobile: req.mobile.replace(/\s/g, ""),
    email: req.email.trim().toLowerCase(),
    password: req.password,
  });
  return data;
}

export async function logoutApi(): Promise<void> {
  await apiClient.post(`${BASE}/logout`, {});
}
