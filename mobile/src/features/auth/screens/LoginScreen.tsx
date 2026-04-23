import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, View } from "react-native";
import { useAppDispatch } from "@/app/hooks";
import type { RootStackParamList } from "@/app/navigation/types";
import { setAuthenticated } from "@/features/auth/state/authSlice";
import { AppButton } from "@/shared/components/AppButton";
import { AppText } from "@/shared/components/AppText";
import { Screen } from "@/shared/components/Screen";
import { useTheme } from "@/shared/theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function LoginScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Nav>();
  const { spacing } = useTheme();

  return (
    <Screen scroll>
      <View style={[styles.stack, { marginTop: spacing["3xl"] }]}>
        <AppText variant="headline">FacePay</AppText>
        <AppText variant="body" color="onSurfaceVariant" style={styles.sub}>
          Sign in (skeleton — Phase 2 design system)
        </AppText>
        <AppButton
          title="Dev: continue as signed in"
          onPress={() => dispatch(setAuthenticated(true))}
          variant="primary"
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate("Signup")}
          style={styles.linkHit}
        >
          <AppText variant="body" color="primary">
            Go to sign up
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
