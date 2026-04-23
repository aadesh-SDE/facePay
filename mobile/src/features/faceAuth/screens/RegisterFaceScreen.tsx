import { useCallback, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loadDescriptorThunk, registerFaceThunk } from "@/features/faceAuth/state/faceThunks";
import { clearFaceError } from "@/features/faceAuth/state/faceSlice";
import { deriveDescriptorFromCaptureBase64 } from "@/shared/lib/deriveDescriptorFromCapture";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { Screen } from "@/shared/components/Screen";
import { useTheme } from "@/shared/theme";

type Step = "intro" | "camera" | "preview";

export function RegisterFaceScreen() {
  const dispatch = useAppDispatch();
  const cameraRef = useRef<InstanceType<typeof CameraView>>(null);
  const { registered, error, verifyStatus } = useAppSelector((s) => s.face);
  const { spacing, colors, radii } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("intro");
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [previewBase64, setPreviewBase64] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [captureErr, setCaptureErr] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        await dispatch(loadDescriptorThunk()).unwrap();
      } catch (e) {
        setLoadErr(typeof e === "string" ? e : "Could not load face status");
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    if (verifyStatus === "success" && step === "preview") {
      setStep("intro");
      setPreviewUri(null);
      setPreviewBase64(null);
    }
  }, [verifyStatus, step]);

  const openCamera = useCallback(async () => {
    setCaptureErr(null);
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        setCaptureErr("Camera permission is required to capture a face photo.");
        return;
      }
    }
    setStep("camera");
  }, [permission?.granted, requestPermission]);

  const takePhoto = useCallback(async () => {
    setCaptureErr(null);
    setCapturing(true);
    try {
      const pic = await cameraRef.current?.takePictureAsync({
        base64: true,
        quality: 0.25,
      });
      if (!pic?.base64) {
        setCaptureErr("Could not read the photo. Try again.");
        return;
      }
      setPreviewUri(pic.uri);
      setPreviewBase64(pic.base64);
      setStep("preview");
    } catch {
      setCaptureErr("Capture failed. Try again.");
    } finally {
      setCapturing(false);
    }
  }, []);

  const onConfirmRegister = () => {
    if (!previewBase64) return;
    dispatch(clearFaceError());
    const descriptor = deriveDescriptorFromCaptureBase64(previewBase64);
    void dispatch(registerFaceThunk(descriptor));
  };

  const onRetake = () => {
    setPreviewUri(null);
    setPreviewBase64(null);
    setCaptureErr(null);
    setStep("camera");
  };

  if (!permission) {
    return (
      <Screen scroll>
        <AppText variant="body">Checking camera…</AppText>
      </Screen>
    );
  }

  return (
    <Screen scroll contentContainerStyle={{ paddingTop: spacing.lg, gap: spacing.base }}>
      <AppText variant="headline">Face template</AppText>
      <AppText variant="bodySmall" color="onSurfaceVariant">
        Take a selfie in good light. We turn the photo into a numeric template for your account
        (Phase 4 spike — not full face-ID ML yet). Payments are still confirmed with device
        biometrics.
      </AppText>
      {loadErr ? (
        <AppText variant="caption" color="error">
          {loadErr}
        </AppText>
      ) : null}
      {error ? (
        <AppText variant="caption" color="error">
          {error}
        </AppText>
      ) : null}
      {captureErr ? (
        <AppText variant="caption" color="error">
          {captureErr}
        </AppText>
      ) : null}
      {registered ? (
        <AppText variant="body" color="primary">
          Face template is registered on this account.
        </AppText>
      ) : (
        <AppText variant="body">No template saved yet.</AppText>
      )}

      {step === "intro" ? (
        <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
          <AppButton title="Take registration photo" onPress={() => void openCamera()} />
        </View>
      ) : null}

      {step === "camera" ? (
        <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
          <View style={[styles.cameraBox, { borderRadius: radii.lg, overflow: "hidden" }]}>
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front" />
          </View>
          <AppButton
            title={capturing ? "Capturing…" : "Capture"}
            onPress={() => void takePhoto()}
            loading={capturing}
            disabled={capturing}
          />
          <AppButton title="Cancel" variant="outline" onPress={() => setStep("intro")} />
        </View>
      ) : null}

      {step === "preview" && previewUri ? (
        <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
          <Image
            source={{ uri: previewUri }}
            style={[styles.preview, { borderRadius: radii.lg, backgroundColor: colors.surfaceDim }]}
            accessibilityLabel="Captured selfie preview"
          />
          <AppButton
            title={verifyStatus === "scanning" ? "Saving…" : "Save template"}
            onPress={onConfirmRegister}
            loading={verifyStatus === "scanning"}
          />
          <AppButton title="Retake" variant="outline" onPress={onRetake} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  cameraBox: {
    width: "100%",
    aspectRatio: 3 / 4,
    maxHeight: 420,
    backgroundColor: "#000",
  },
  preview: {
    width: "100%",
    aspectRatio: 3 / 4,
    maxHeight: 420,
  },
});
