export const colors = {
  light: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',

    background: '#FFFFFF',
    backgroundSecondary: '#F2F2F7',
    backgroundTertiary: '#E5E5EA',

    text: '#000000',
    textSecondary: '#3C3C43',
    textTertiary: '#8E8E93',
    textPlaceholder: '#C7C7CC',

    border: '#D1D1D6',
    separator: '#E5E5EA',
    overlay: 'rgba(0, 0, 0, 0.4)',

    card: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.1)',

    // Mind map node colors
    nodeRed: '#FF6B6B',
    nodeOrange: '#FFA06B',
    nodeYellow: '#FFD93D',
    nodeGreen: '#6BCF7F',
    nodeBlue: '#6BA3FF',
    nodePurple: '#9B6BFF',
    nodePink: '#FF6BB5',
    nodeGray: '#A0A0A0',
  },

  dark: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#64D2FF',

    background: '#000000',
    backgroundSecondary: '#1C1C1E',
    backgroundTertiary: '#2C2C2E',

    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#8E8E93',
    textPlaceholder: '#48484A',

    border: '#38383A',
    separator: '#38383A',
    overlay: 'rgba(0, 0, 0, 0.6)',

    card: '#1C1C1E',
    cardShadow: 'rgba(0, 0, 0, 0.3)',

    // Mind map node colors
    nodeRed: '#FF6B6B',
    nodeOrange: '#FFA06B',
    nodeYellow: '#FFD93D',
    nodeGreen: '#6BCF7F',
    nodeBlue: '#6BA3FF',
    nodePurple: '#9B6BFF',
    nodePink: '#FF6BB5',
    nodeGray: '#A0A0A0',
  },
};

export type ColorTheme = keyof typeof colors;
export type ColorKey = keyof typeof colors.light;
