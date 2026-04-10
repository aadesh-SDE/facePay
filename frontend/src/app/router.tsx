import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import type { ReactNode } from "react";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

import { LoginPage } from "@/pages/login/LoginPage";
import { SignupPage } from "@/pages/signup/SignupPage";
import { RegisterFacePage } from "@/pages/registerFace/RegisterFacePage";
import { FaceVerificationPage } from "@/pages/faceVerification/FaceVerificationPage";
import { VerificationFailedPage } from "@/pages/verificationFailed/VerificationFailedPage";
import { HomePage } from "@/pages/home/HomePage";
import { SelectRecipientPage } from "@/pages/selectRecipient/SelectRecipientPage";
import { EnterAmountPage } from "@/pages/enterAmount/EnterAmountPage";
import { ReviewPaymentPage } from "@/pages/reviewPayment/ReviewPaymentPage";
import { SuccessReceiptPage } from "@/pages/successReceipt/SuccessReceiptPage";
import { HistoryPage } from "@/pages/history/HistoryPage";
import { MyQRCodePage } from "@/pages/myQrCode/MyQRCodePage";
import { ScanQRPage } from "@/pages/scanQr/ScanQRPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";

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

function Guarded({
  children,
  guest,
  feature,
}: {
  children: ReactNode;
  guest?: boolean;
  feature: string;
}) {
  const Guard = guest ? GuestGuard : AuthGuard;
  return (
    <ErrorBoundary featureName={feature}>
      <Guard>{children}</Guard>
    </ErrorBoundary>
  );
}

const routes: RouteObject[] = [
  {
    path: "/login",
    element: (
      <Guarded guest feature="Auth">
        <LoginPage />
      </Guarded>
    ),
  },
  {
    path: "/signup",
    element: (
      <Guarded guest feature="Auth">
        <SignupPage />
      </Guarded>
    ),
  },
  {
    path: "/",
    element: (
      <Guarded feature="Home">
        <HomePage />
      </Guarded>
    ),
  },
  {
    path: "/register-face",
    element: (
      <Guarded feature="Face Auth">
        <RegisterFacePage />
      </Guarded>
    ),
  },
  {
    path: "/send",
    element: (
      <Guarded feature="Send Money">
        <SelectRecipientPage />
      </Guarded>
    ),
  },
  {
    path: "/send/amount",
    element: (
      <Guarded feature="Send Money">
        <EnterAmountPage />
      </Guarded>
    ),
  },
  {
    path: "/send/review",
    element: (
      <Guarded feature="Send Money">
        <ReviewPaymentPage />
      </Guarded>
    ),
  },
  {
    path: "/send/success",
    element: (
      <Guarded feature="Send Money">
        <SuccessReceiptPage />
      </Guarded>
    ),
  },
  {
    path: "/send/verify",
    element: (
      <Guarded feature="Face Verification">
        <FaceVerificationPage />
      </Guarded>
    ),
  },
  {
    path: "/send/verify/failed",
    element: (
      <Guarded feature="Face Verification">
        <VerificationFailedPage />
      </Guarded>
    ),
  },
  {
    path: "/history",
    element: (
      <Guarded feature="Transaction History">
        <HistoryPage />
      </Guarded>
    ),
  },
  {
    path: "/receive",
    element: (
      <Guarded feature="Receive Money">
        <MyQRCodePage />
      </Guarded>
    ),
  },
  {
    path: "/receive/scan",
    element: (
      <Guarded feature="QR Scanner">
        <ScanQRPage />
      </Guarded>
    ),
  },
  {
    path: "/profile",
    element: (
      <Guarded feature="Profile">
        <ProfilePage />
      </Guarded>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export const router = createBrowserRouter(routes);
