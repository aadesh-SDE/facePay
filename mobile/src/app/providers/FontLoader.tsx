import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import type { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTheme } from "@/shared/theme";

type Props = {
  children: ReactNode;
};

export function FontLoader({ children }: Props) {
  const { colors } = useTheme();
  const [loaded, error] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!loaded) {
    if (error) {
      return children;
    }
    return (
      <View
        style={[styles.center, { backgroundColor: colors.background }]}
        accessibilityLabel="Loading fonts"
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
