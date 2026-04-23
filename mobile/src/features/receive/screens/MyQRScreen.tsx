import { useEffect, useLayoutEffect } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import QRCode from "react-native-qrcode-svg";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import type { ReceiveStackParamList } from "@/app/navigation/types";
import { loadMyQRThunk } from "@/features/receive/state/receiveThunks";
import { AppText } from "@/shared/components/AppText";
import { Screen } from "@/shared/components/Screen";
import { useTheme } from "@/shared/theme";

type Nav = NativeStackNavigationProp<ReceiveStackParamList>;

export function MyQRScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { qrData, loading, error } = useAppSelector((s) => s.receive);
  const { spacing, colors } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate("ReceiveScan")}
          style={{ paddingHorizontal: 12, paddingVertical: 8 }}
        >
          <AppText variant="label" color="primary">
            Scan
          </AppText>
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    void dispatch(loadMyQRThunk());
  }, [dispatch]);

  const value = qrData ? JSON.stringify(qrData) : "";

  return (
    <Screen scroll contentContainerStyle={{ paddingTop: spacing.lg }}>
      <View style={{ gap: spacing.base, alignItems: "center" }}>
        <AppText variant="headline">Receive</AppText>
        <AppText variant="bodySmall" color="onSurfaceVariant" style={{ textAlign: "center" }}>
          Show this QR so others can pay you.
        </AppText>
        {error ? (
          <AppText variant="bodySmall" color="error">
            {error}
          </AppText>
        ) : null}
        {loading && !qrData ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : null}
        {value ? (
          <View style={[styles.qrWrap, { backgroundColor: colors.surfaceContainerLowest }]}>
            <QRCode value={value} size={220} />
          </View>
        ) : null}
        {qrData ? (
          <AppText variant="caption" color="onSurfaceVariant">
            {qrData.name} · {qrData.mobile}
          </AppText>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  qrWrap: {
    padding: 16,
    borderRadius: 12,
  },
});
