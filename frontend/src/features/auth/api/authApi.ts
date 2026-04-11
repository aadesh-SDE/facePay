import api from "@/shared/services/api";
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
} from "../types/auth.types";

const BASE = "/api/v1/auth";

export async function loginApi(req: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(`${BASE}/login`, {
    mobile: req.mobile.replace(/\s/g, ""),
    password: req.password,
  });
  return data;
}

export async function signupApi(req: SignupRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(`${BASE}/signup`, {
    name: req.name,
    mobile: req.mobile.replace(/\s/g, ""),
    email: req.email.trim(),
    password: req.password,
  });
  return data;
}

export async function logoutApi(): Promise<void> {
  await api.post(`${BASE}/logout`, {});
}
