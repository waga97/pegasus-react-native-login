export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  input: 12,
  button: 16,
  card: 16,
} as const;

export const inputHeight = 56;
export const buttonHeight = 56;
export const maxWidth = 640;

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
