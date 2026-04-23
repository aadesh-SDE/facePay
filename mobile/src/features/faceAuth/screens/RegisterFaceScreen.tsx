import { useEffect, useState } from "react";
import { View } from "react-native";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loadDescriptorThunk, registerFaceThunk } from "@/features/faceAuth/state/faceThunks";
import { clearFaceError } from "@/features/faceAuth/state/faceSlice";
import { createDemoFaceDescriptor } from "@/shared/lib/demoFaceDescriptor";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { Screen } from "@/shared/components/Screen";
import { useTheme } from "@/shared/theme";

export function RegisterFaceScreen() {
  const dispatch = useAppDispatch();
  const { registered, error, verifyStatus } = useAppSelector((s) => s.face);
  const { spacing } = useTheme();
  const [loadErr, setLoadErr] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        await dispatch(loadDescriptorThunk()).unwrap();
      } catch (e) {
        setLoadErr(typeof e === "string" ? e : "Could not load face status");
      }
    })();
  }, [dispatch]);

  const onRegister = () => {
    dispatch(clearFaceError());
    void dispatch(registerFaceThunk(createDemoFaceDescriptor()));
  };

  return (
    <Screen scroll contentContainerStyle={{ paddingTop: spacing.lg, gap: spacing.base }}>
      <AppText variant="headline">Face template</AppText>
      <AppText variant="bodySmall" color="onSurfaceVariant">
        Mobile uses a demo embedding until on-device models are wired. Transfers are still
        confirmed with device biometrics.
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
      {registered ? (
        <AppText variant="body" color="primary">
          Face template is registered on this account.
        </AppText>
      ) : (
        <AppText variant="body">No template saved yet.</AppText>
      )}
      <View style={{ marginTop: spacing.md }}>
        <AppButton
          title={registered ? "Update template" : "Register template"}
          onPress={onRegister}
          loading={verifyStatus === "scanning"}
        />
      </View>
    </Screen>
  );
}
