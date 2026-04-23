import { useCallback, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NavigationProp, ParamListBase } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useAppDispatch } from "@/app/hooks";
import { navigateRootStack } from "@/app/navigation/rootNavigation";
import { resolveQR } from "@/features/receive/api/receiveApi";
import { resetSend, setRecipient } from "@/features/send/state/sendSlice";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { Screen } from "@/shared/components/Screen";
import { useTheme } from "@/shared/theme";

const SCAN_COOLDOWN_MS = 2200;

export function ScanQRScreen() {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useAppDispatch();
  const { spacing, colors, radii } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [message, setMessage] = useState<string | null>(null);
  const handled = useRef(false);
  const cooldownUntil = useRef(0);
  const [torch, setTorch] = useState(false);

  useFocusEffect(
    useCallback(() => {
      handled.current = false;
      cooldownUntil.current = 0;
      setMessage(null);
      setTorch(false);
    }, []),
  );

  const onBarcodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      if (handled.current) return;
      if (Date.now() < cooldownUntil.current) return;
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
        if (Platform.OS !== "web") {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        navigateRootStack(navigation, "EnterAmount");
      } catch (e) {
        if (Platform.OS !== "web") {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        setMessage(e instanceof Error ? e.message : "Invalid QR");
        cooldownUntil.current = Date.now() + SCAN_COOLDOWN_MS;
        setTimeout(() => {
          handled.current = false;
        }, SCAN_COOLDOWN_MS);
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
        <View style={styles.titleRow}>
          <AppText variant="title">Scan QR</AppText>
          <Pressable
            onPress={() => setTorch((t) => !t)}
            style={({ pressed }) => [
              styles.torchBtn,
              {
                borderRadius: radii.md,
                borderColor: colors.outlineVariant,
                backgroundColor: colors.surfaceContainerLowest,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <AppText variant="caption" color="primary">
              {torch ? "Torch off" : "Torch on"}
            </AppText>
          </Pressable>
        </View>
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
            enableTorch={torch}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={onBarcodeScanned}
          />
        </View>
        <AppButton
          title="Scan again"
          variant="outline"
          onPress={() => {
            handled.current = false;
            cooldownUntil.current = 0;
            setMessage(null);
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  torchBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  cameraBox: {
    flex: 1,
    minHeight: 320,
    borderRadius: 12,
    overflow: "hidden",
  },
});
