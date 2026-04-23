import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAppSelector } from "@/app/hooks";
import { MainTabsNavigator } from "@/app/navigation/MainTabsNavigator";
import type { RootStackParamList } from "@/app/navigation/types";
import { EnterAmountPage } from "@/pages/enterAmount/EnterAmountPage";
import { FaceVerificationPage } from "@/pages/faceVerification/FaceVerificationPage";
import { LoginPage } from "@/pages/login/LoginPage";
import { RegisterFacePage } from "@/pages/registerFace/RegisterFacePage";
import { ReviewPaymentPage } from "@/pages/reviewPayment/ReviewPaymentPage";
import { SelectRecipientPage } from "@/pages/selectRecipient/SelectRecipientPage";
import { SignupPage } from "@/pages/signup/SignupPage";
import { SuccessReceiptPage } from "@/pages/successReceipt/SuccessReceiptPage";
import { VerificationFailedPage } from "@/pages/verificationFailed/VerificationFailedPage";

const Stack = createNativeStackNavigator<RootStackParamList>();

const modalHeader = { headerShown: true as const };

export function RootNavigator() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  return (
    <Stack.Navigator
      key={isAuthenticated ? "app" : "auth"}
      screenOptions={{ headerShown: false }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
          <Stack.Screen
            name="SelectRecipient"
            component={SelectRecipientPage}
            options={{ ...modalHeader, title: "Send money" }}
          />
          <Stack.Screen
            name="EnterAmount"
            component={EnterAmountPage}
            options={{ ...modalHeader, title: "Amount" }}
          />
          <Stack.Screen
            name="ReviewPayment"
            component={ReviewPaymentPage}
            options={{ ...modalHeader, title: "Review" }}
          />
          <Stack.Screen
            name="FaceVerification"
            component={FaceVerificationPage}
            options={{ ...modalHeader, title: "Verify" }}
          />
          <Stack.Screen
            name="VerificationFailed"
            component={VerificationFailedPage}
            options={{ ...modalHeader, title: "Payment" }}
          />
          <Stack.Screen
            name="SuccessReceipt"
            component={SuccessReceiptPage}
            options={{ ...modalHeader, title: "Sent" }}
          />
          <Stack.Screen
            name="RegisterFace"
            component={RegisterFacePage}
            options={{ ...modalHeader, title: "Face template" }}
          />
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
