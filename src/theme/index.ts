import {colors} from './colors';
import {typography} from './typography';
import {spacing, borderRadius, shadows, hitSlop} from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  hitSlop,
};

export * from './colors';
export * from './typography';
export * from './spacing';

export type Theme = typeof theme;
