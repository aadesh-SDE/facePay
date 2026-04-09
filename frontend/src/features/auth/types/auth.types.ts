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

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
