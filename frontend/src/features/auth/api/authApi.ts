import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
} from "../types/auth.types";

const MOCK_DELAY = 800;

const mockUsers = [
  {
    id: "usr_001",
    name: "Adesh M",
    mobile: "9876543210",
    email: "adesh@facepay.demo",
    password: "demo123",
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginApi(req: LoginRequest): Promise<AuthResponse> {
  await delay(MOCK_DELAY);

  const user = mockUsers.find(
    (u) => u.mobile === req.mobile.replace(/\s/g, "") && u.password === req.password,
  );

  if (!user) {
    throw new Error("Invalid mobile number or password");
  }

  const { password: _, ...safeUser } = user;
  return {
    user: safeUser,
    token: `mock_token_${Date.now()}`,
  };
}

export async function signupApi(req: SignupRequest): Promise<AuthResponse> {
  await delay(MOCK_DELAY);

  const exists = mockUsers.find(
    (u) => u.mobile === req.mobile.replace(/\s/g, ""),
  );
  if (exists) {
    throw new Error("Mobile number already registered");
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name: req.name,
    mobile: req.mobile.replace(/\s/g, ""),
    email: req.email,
    password: req.password,
  };
  mockUsers.push(newUser);

  const { password: _, ...safeUser } = newUser;
  return {
    user: safeUser,
    token: `mock_token_${Date.now()}`,
  };
}

export async function logoutApi(): Promise<void> {
  await delay(300);
}
