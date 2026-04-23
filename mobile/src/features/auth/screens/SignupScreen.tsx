import { useState } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, View } from "react-native";
import type { RootStackParamList } from "@/app/navigation/types";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { AppTextField } from "@/shared/components/AppTextField";
import { Screen } from "@/shared/components/Screen";
import { useTheme } from "@/shared/theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SignupScreen() {
  const navigation = useNavigation<Nav>();
  const { spacing } = useTheme();
  const [email, setEmail] = useState("");

  return (
    <Screen scroll>
      <View style={[styles.stack, { marginTop: spacing["3xl"] }]}>
        <AppText variant="headline">Sign up</AppText>
        <AppText variant="body" color="onSurfaceVariant" style={styles.sub}>
          Skeleton — `AppTextField` demo for Phase 2.
        </AppText>
        <AppTextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
        />
        <AppButton
          title="Create account (stub)"
          onPress={() => {}}
          variant="secondary"
          disabled
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate("Login")}
          style={styles.linkHit}
        >
          <AppText variant="body" color="primary">
            Back to sign in
          </AppText>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  sub: { marginTop: 4 },
  linkHit: { alignSelf: "center", paddingVertical: 8 },
});
