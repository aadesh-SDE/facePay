import type { ReactNode } from "react";
import { Text, type StyleProp, type TextStyle } from "react-native";
import { useTheme } from "@/shared/theme";
import type { textVariants } from "@/shared/theme/typography";

type Variant = keyof typeof textVariants;

type TextColor =
  | "onSurface"
  | "onSurfaceVariant"
  | "onPrimary"
  | "onPrimaryContainer"
  | "primary"
  | "error"
  | "outline";

type Props = {
  children: ReactNode;
  variant?: Variant;
  color?: TextColor;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

export function AppText({
  children,
  variant = "body",
  color = "onSurface",
  style,
  numberOfLines,
}: Props) {
  const { colors, textVariants: variants } = useTheme();
  const preset = variants[variant];
  const colorValue = colors[color] as string;

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[preset, { color: colorValue }, style]}
    >
      {children}
    </Text>
  );
}
