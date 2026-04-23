/** Matches `frontend/tailwind.config.ts` borderRadius scale (px). */
export const radii = {
  none: 0,
  sm: 4,
  DEFAULT: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export type Radii = typeof radii;
