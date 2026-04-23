import { useCallback, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import type { RootStackParamList } from "@/app/navigation/types";
import { submitTransferThunk } from "@/features/send/state/sendThunks";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { Screen } from "@/shared/components/Screen";
import { getApiErrorMessage } from "@/shared/lib/getApiErrorMessage";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import { useTheme } from "@/shared/theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function FaceVerificationScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { recipient, amount, note, loading } = useAppSelector((s) => s.send);
  const { spacing } = useTheme();
  const [localError, setLocalError] = useState<string | null>(null);

  const runVerify = useCallback(async () => {
    setLocalError(null);
    if (!recipient) {
      navigation.replace("VerificationFailed", {
        message: "Missing recipient. Go back and pick someone to pay.",
      });
      return;
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !enrolled) {
      navigation.replace("VerificationFailed", {
        message: "Set up Face ID, Touch ID, or a device PIN to confirm payments.",
      });
      return;
    }

    const bio = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authorize payment",
      cancelLabel: "Cancel",
    });

    if (!bio.success) {
      navigation.replace("VerificationFailed", {
        message:
          bio.error === "user_cancel"
            ? "You cancelled verification."
            : "Biometric verification failed.",
      });
      return;
    }

    try {
      const result = await dispatch(
        submitTransferThunk({
          recipientId: recipient.id,
          amount,
          note: note || undefined,
        }),
      ).unwrap();
      navigation.replace("SuccessReceipt", { transactionId: result.transactionId });
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : getApiErrorMessage(err, "Transfer failed");
      navigation.replace("VerificationFailed", { message });
    }
  }, [amount, dispatch, navigation, note, recipient]);

  return (
    <Screen scroll contentContainerStyle={{ paddingTop: spacing.lg, gap: spacing.base }}>
      <AppText variant="headline">Verify</AppText>
      <AppText variant="bodySmall" color="onSurfaceVariant">
        Confirm with your device biometrics to send{" "}
        {recipient ? `${recipient.name} ` : ""}
        {amount ? formatCurrency(amount) : ""}.
      </AppText>
      {localError ? (
        <AppText variant="caption" color="error">
          {localError}
        </AppText>
      ) : null}
      <AppButton
        title={loading ? "Sending…" : "Verify and send"}
        onPress={() => void runVerify()}
        loading={loading}
      />
    </Screen>
  );
}
