import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "@/shared/theme";

type Props = {
  children: ReactNode;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, elevated = true, style }: Props) {
  const { colors, radii, spacing, shadows } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceContainerLow,
          borderRadius: radii.lg,
          padding: spacing.base,
        },
        elevated ? shadows.whisper : undefined,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
});
