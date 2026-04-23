import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from "react-native";
import { useTheme } from "@/shared/theme";
import { AppText } from "@/shared/components/AppText";

type Variant = "primary" | "secondary" | "outline" | "ghost";

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  style?: ViewStyle;
};

export function AppButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  leftIcon,
  style,
}: Props) {
  const { colors, radii, spacing } = useTheme();
  const isDisabled = disabled || loading;

  const palette = {
    primary: {
      bg: colors.primary,
      text: "onPrimary" as const,
      border: colors.primary,
    },
    secondary: {
      bg: colors.primaryContainer,
      text: "onPrimary" as const,
      border: colors.primaryContainer,
    },
    outline: {
      bg: "transparent",
      text: "primary" as const,
      border: colors.outline,
    },
    ghost: {
      bg: "transparent",
      text: "primary" as const,
      border: "transparent",
    },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor:
            palette.bg === "transparent" ? "transparent" : palette.bg,
          borderColor: palette.border,
          borderWidth: variant === "outline" ? 1 : 0,
          borderRadius: radii.lg,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.base,
          opacity: pressed && !isDisabled ? 0.88 : isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "ghost" ? colors.primary : colors.onPrimary}
        />
      ) : (
        <>
          {leftIcon}
          <AppText
            variant="label"
            color={palette.text}
            style={leftIcon ? styles.gap : undefined}
          >
            {title}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  gap: { marginLeft: 8 },
});
