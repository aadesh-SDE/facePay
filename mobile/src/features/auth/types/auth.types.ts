export interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  avatar?: string;
}

export interface LoginRequest {
  mobile: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  mobile: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface MeResponse {
  id: string;
  name: string;
  mobile: string;
  email: string;
  joinedAt: string;
  faceRegistered: boolean;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  /** True until SecureStore + optional `/me` bootstrap finishes. */
  bootstrapping: boolean;
}
