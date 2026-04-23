import type { TextStyle } from "react-native";

/** PostScript names after `useFonts` from `@expo-google-fonts/manrope`. */
export const fontFamily = {
  regular: "Manrope_400Regular",
  medium: "Manrope_500Medium",
  semibold: "Manrope_600SemiBold",
  bold: "Manrope_700Bold",
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

/** Presets consumed by `AppText` variants. */
export const textVariants: Record<
  "display" | "headline" | "title" | "body" | "bodySmall" | "label" | "caption",
  Pick<TextStyle, "fontSize" | "lineHeight" | "fontFamily">
> = {
  display: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize["4xl"],
    lineHeight: Math.round(fontSize["4xl"] * 1.15),
  },
  headline: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize["2xl"],
    lineHeight: Math.round(fontSize["2xl"] * 1.2),
  },
  title: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.xl,
    lineHeight: Math.round(fontSize.xl * 1.25),
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    lineHeight: Math.round(fontSize.base * 1.45),
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: Math.round(fontSize.sm * 1.45),
  },
  label: {
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.sm,
    lineHeight: Math.round(fontSize.sm * 1.35),
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: Math.round(fontSize.xs * 1.4),
  },
};
