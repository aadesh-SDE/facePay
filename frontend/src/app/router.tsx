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
        <PlaceholderPage title="Home Dashboard" />
      </AuthGuard>
    ),
  },
  {
    path: "/register-face",
    element: (
      <AuthGuard>
        <PlaceholderPage title="Register Face" />
      </AuthGuard>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-on-surface mb-2">{title}</h1>
        <p className="text-on-surface-variant">Coming in next phase</p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter(routes);
