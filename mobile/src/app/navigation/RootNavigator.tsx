import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "@/app/hooks";
import type { RootStackParamList } from "@/app/navigation/types";
import { EnterAmountPage } from "@/pages/enterAmount/EnterAmountPage";
import { FaceVerificationPage } from "@/pages/faceVerification/FaceVerificationPage";
import { HistoryPage } from "@/pages/history/HistoryPage";
import { HomePage } from "@/pages/home/HomePage";
import { LoginPage } from "@/pages/login/LoginPage";
import { MyQRCodePage } from "@/pages/myQrCode/MyQRCodePage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { RegisterFacePage } from "@/pages/registerFace/RegisterFacePage";
import { ReviewPaymentPage } from "@/pages/reviewPayment/ReviewPaymentPage";
import { ScanQRPage } from "@/pages/scanQr/ScanQRPage";
import { SelectRecipientPage } from "@/pages/selectRecipient/SelectRecipientPage";
import { SignupPage } from "@/pages/signup/SignupPage";
import { SuccessReceiptPage } from "@/pages/successReceipt/SuccessReceiptPage";
import { VerificationFailedPage } from "@/pages/verificationFailed/VerificationFailedPage";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Phase 1: guest sees Login / Signup; authed user lands on Home.
 * Other app routes are registered for type parity and future navigation;
 * they are not linked from UI until later phases.
 */
export function RootNavigator() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  return (
    <Stack.Navigator
      key={isAuthenticated ? "app" : "auth"}
      screenOptions={{ headerShown: false }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="RegisterFace" component={RegisterFacePage} />
          <Stack.Screen name="FaceVerification" component={FaceVerificationPage} />
          <Stack.Screen name="VerificationFailed" component={VerificationFailedPage} />
          <Stack.Screen name="SelectRecipient" component={SelectRecipientPage} />
          <Stack.Screen name="EnterAmount" component={EnterAmountPage} />
          <Stack.Screen name="ReviewPayment" component={ReviewPaymentPage} />
          <Stack.Screen name="SuccessReceipt" component={SuccessReceiptPage} />
          <Stack.Screen name="History" component={HistoryPage} />
          <Stack.Screen name="MyQRCode" component={MyQRCodePage} />
          <Stack.Screen name="ScanQR" component={ScanQRPage} />
          <Stack.Screen name="Profile" component={ProfilePage} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Signup" component={SignupPage} />
        </>
      )}
    </Stack.Navigator>
  );
}
