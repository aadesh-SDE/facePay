import { useState } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, View } from "react-native";
import type { RootStackParamList } from "@/app/navigation/types";
import { useAuthViewModel } from "@/features/auth/viewModel/useAuthViewModel";
import { loginThunk } from "@/features/auth/state/authThunks";
import { useAppDispatch } from "@/app/hooks";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { AppTextField } from "@/shared/components/AppTextField";
import { Screen } from "@/shared/components/Screen";
import { useTheme } from "@/shared/theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function LoginScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();
  const { loading, error, clearError } = useAuthViewModel();
  const { spacing } = useTheme();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    clearError();
    await dispatch(loginThunk({ mobile: mobile.trim(), password }));
  }

  return (
    <Screen scroll>
      <View style={[styles.stack, { marginTop: spacing["2xl"] }]}>
        <AppText variant="headline">Welcome back</AppText>
        <AppText variant="body" color="onSurfaceVariant" style={styles.sub}>
          Sign in with your mobile number and password.
        </AppText>

        <AppTextField
          label="Mobile number"
          value={mobile}
          onChangeText={setMobile}
          placeholder="10-digit mobile"
          keyboardType="phone-pad"
        />
        <AppTextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        {error ? (
          <View style={styles.errorBox}>
            <AppText variant="bodySmall" color="error">
              {error}
            </AppText>
          </View>
        ) : null}

        <AppButton
          title={loading ? "Signing in…" : "Sign in"}
          onPress={() => void handleSubmit()}
          variant="primary"
          loading={loading}
          disabled={loading || !mobile.trim() || !password}
        />

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate("Signup")}
          style={styles.linkHit}
        >
          <AppText variant="body" color="primary">
            Create an account
          </AppText>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 14 },
  sub: { marginTop: 4 },
  errorBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#ffdad6",
  },
  linkHit: { alignSelf: "center", paddingVertical: 8 },
});
