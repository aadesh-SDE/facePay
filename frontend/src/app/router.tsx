import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import type { ReactNode } from "react";

import { LoginPage } from "@/pages/login/LoginPage";
import { SignupPage } from "@/pages/signup/SignupPage";
import { RegisterFacePage } from "@/pages/registerFace/RegisterFacePage";
import { FaceVerificationPage } from "@/pages/faceVerification/FaceVerificationPage";
import { VerificationFailedPage } from "@/pages/verificationFailed/VerificationFailedPage";
import { HomePage } from "@/pages/home/HomePage";

function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function GuestGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const routes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: "/signup",
    element: (
      <GuestGuard>
        <SignupPage />
      </GuestGuard>
    ),
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <HomePage />
      </AuthGuard>
    ),
  },
  {
    path: "/register-face",
    element: (
      <AuthGuard>
        <RegisterFacePage />
      </AuthGuard>
    ),
  },
  {
    path: "/send/verify",
    element: (
      <AuthGuard>
        <FaceVerificationPage />
      </AuthGuard>
    ),
  },
  {
    path: "/send/verify/failed",
    element: (
      <AuthGuard>
        <VerificationFailedPage />
      </AuthGuard>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export const router = createBrowserRouter(routes);
