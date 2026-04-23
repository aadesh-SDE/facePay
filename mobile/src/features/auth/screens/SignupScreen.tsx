import { useState } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, View } from "react-native";
import { useAppDispatch } from "@/app/hooks";
import type { RootStackParamList } from "@/app/navigation/types";
import { signupThunk } from "@/features/auth/state/authThunks";
import { useAuthViewModel } from "@/features/auth/viewModel/useAuthViewModel";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { AppTextField } from "@/shared/components/AppTextField";
import { Screen } from "@/shared/components/Screen";
import { useTheme } from "@/shared/theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SignupScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();
  const { loading, error, clearError } = useAuthViewModel();
  const { spacing } = useTheme();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    clearError();
    await dispatch(
      signupThunk({
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        password,
      }),
    );
  }

  const canSubmit =
    name.trim().length > 0 &&
    mobile.trim().length > 0 &&
    email.includes("@") &&
    password.length >= 6;

  return (
    <Screen scroll>
      <View style={[styles.stack, { marginTop: spacing["2xl"] }]}>
        <AppText variant="headline">Create account</AppText>
        <AppText variant="body" color="onSurfaceVariant" style={styles.sub}>
          Same fields as web — you will be signed in after success.
        </AppText>

        <AppTextField
          label="Full name"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          autoCapitalize="words"
        />
        <AppTextField
          label="Mobile number"
          value={mobile}
          onChangeText={setMobile}
          placeholder="10-digit mobile"
          keyboardType="phone-pad"
        />
        <AppTextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
        />
        <AppTextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Min 6 characters"
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
          title={loading ? "Creating…" : "Sign up"}
          onPress={() => void handleSubmit()}
          variant="primary"
          loading={loading}
          disabled={loading || !canSubmit}
        />

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate("Login")}
          style={styles.linkHit}
        >
          <AppText variant="body" color="primary">
            Already have an account? Sign in
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
