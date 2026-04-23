import { colors } from "@/shared/theme/colors";
import { radii } from "@/shared/theme/radii";
import { shadows } from "@/shared/theme/shadows";
import { spacing } from "@/shared/theme/spacing";
import { fontFamily, fontSize, textVariants } from "@/shared/theme/typography";

export const theme = {
  colors,
  spacing,
  radii,
  shadows,
  fontFamily,
  fontSize,
  textVariants,
} as const;

export type Theme = typeof theme;
