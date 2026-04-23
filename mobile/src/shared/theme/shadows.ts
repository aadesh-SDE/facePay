import type { ViewStyle } from "react-native";

/** Approximate web `boxShadow` tokens for RN `View` styles. */
export const shadows = {
  none: {},
  whisper: {
    shadowColor: "#191c1d",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 3,
  },
  glow: {
    shadowColor: "#00535b",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },
  soft: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 2,
  },
  elevated: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
} as const satisfies Record<string, ViewStyle>;

export type ShadowName = keyof typeof shadows;
