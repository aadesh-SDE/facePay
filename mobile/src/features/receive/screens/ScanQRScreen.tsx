import { useCallback, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAppDispatch } from "@/app/hooks";
import { navigateRootStack } from "@/app/navigation/rootNavigation";
import { resolveQR } from "@/features/receive/api/receiveApi";
import { resetSend, setRecipient } from "@/features/send/state/sendSlice";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { Screen } from "@/shared/components/Screen";
import { useTheme } from "@/shared/theme";

export function ScanQRScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();
  const { spacing } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [message, setMessage] = useState<string | null>(null);
  const handled = useRef(false);

  const onBarcodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      if (handled.current) return;
      handled.current = true;
      setMessage(null);
      try {
        const qr = await resolveQR(data);
        dispatch(resetSend());
        dispatch(
          setRecipient({
            id: qr.userId,
            name: qr.name,
            mobile: qr.mobile,
          }),
        );
        navigateRootStack(navigation, "EnterAmount");
      } catch (e) {
        handled.current = false;
        setMessage(e instanceof Error ? e.message : "Invalid QR");
      }
    },
    [dispatch, navigation],
  );

  if (!permission) {
    return (
      <Screen scroll>
        <AppText variant="body">Checking camera…</AppText>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen scroll contentContainerStyle={{ gap: spacing.base, paddingTop: spacing.lg }}>
        <AppText variant="headline">Camera access</AppText>
        <AppText variant="bodySmall" color="onSurfaceVariant">
          Allow camera to scan a payment QR code.
        </AppText>
        <AppButton title="Allow camera" onPress={() => void requestPermission()} />
      </Screen>
    );
  }

  return (
    <Screen scroll={false} contentContainerStyle={{ flex: 1 }}>
      <View style={{ flex: 1, gap: spacing.sm }}>
        <AppText variant="title">Scan QR</AppText>
        {message ? (
          <AppText variant="bodySmall" color="error">
            {message}
          </AppText>
        ) : (
          <AppText variant="caption" color="onSurfaceVariant">
            Point at the other person{"'"}s FacePay QR.
          </AppText>
        )}
        <View style={styles.cameraBox}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={onBarcodeScanned}
          />
        </View>
        <AppButton
          title="Scan again"
          variant="outline"
          onPress={() => {
            handled.current = false;
            setMessage(null);
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cameraBox: {
    flex: 1,
    minHeight: 320,
    borderRadius: 12,
    overflow: "hidden",
  },
});
