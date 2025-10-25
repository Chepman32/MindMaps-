import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors, ColorTheme} from '../theme/colors';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    nodeRed: string;
    nodeOrange: string;
    nodeYellow: string;
    nodeGreen: string;
    nodeBlue: string;
    nodePurple: string;
    nodePink: string;
  };
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Classic iOS-inspired theme',
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#FFFFFF',
      text: '#000000',
      nodeRed: '#FF6B6B',
      nodeOrange: '#FFA06B',
      nodeYellow: '#FFD93D',
      nodeGreen: '#6BCF7F',
      nodeBlue: '#6BA3FF',
      nodePurple: '#9B6BFF',
      nodePink: '#FF6BB5',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blue tones',
    colors: {
      primary: '#0077BE',
      secondary: '#00A8E8',
      background: '#F0F8FF',
      text: '#002B5C',
      nodeRed: '#E07A5F',
      nodeOrange: '#F2CC8F',
      nodeYellow: '#81B29A',
      nodeGreen: '#3D5A80',
      nodeBlue: '#0077BE',
      nodePurple: '#6C5B7B',
      nodePink: '#C06C84',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green palette',
    colors: {
      primary: '#2D6A4F',
      secondary: '#52B788',
      background: '#F8F9FA',
      text: '#1B4332',
      nodeRed: '#D62828',
      nodeOrange: '#F77F00',
      nodeYellow: '#FCBF49',
      nodeGreen: '#52B788',
      nodeBlue: '#2D6A4F',
      nodePurple: '#40916C',
      nodePink: '#95D5B2',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange and pink hues',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      background: '#FFF8F0',
      text: '#3D2817',
      nodeRed: '#FF6B35',
      nodeOrange: '#F7931E',
      nodeYellow: '#FDC500',
      nodeGreen: '#C1666B',
      nodeBlue: '#4357AD',
      nodePurple: '#8B5CF6',
      nodePink: '#EC4899',
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Clean black and white',
    colors: {
      primary: '#000000',
      secondary: '#6B7280',
      background: '#FFFFFF',
      text: '#000000',
      nodeRed: '#1F2937',
      nodeOrange: '#374151',
      nodeYellow: '#4B5563',
      nodeGreen: '#6B7280',
      nodeBlue: '#9CA3AF',
      nodePurple: '#D1D5DB',
      nodePink: '#E5E7EB',
    },
  },
];

interface ThemeState {
  mode: ColorTheme;
  currentPreset: string;
  customColors: Partial<ThemePreset['colors']>;

  // Actions
  setMode: (mode: ColorTheme) => void;
  setPreset: (presetId: string) => void;
  setCustomColor: (key: keyof ThemePreset['colors'], value: string) => void;
  getColors: () => ThemePreset['colors'];
  getPresets: () => ThemePreset[];
  getCurrentPreset: () => ThemePreset | undefined;
  resetToDefault: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      currentPreset: 'default',
      customColors: {},

      setMode: (mode) => {
        set({mode});
      },

      setPreset: (presetId) => {
        set({currentPreset: presetId, customColors: {}});
      },

      setCustomColor: (key, value) => {
        set((state) => ({
          customColors: {
            ...state.customColors,
            [key]: value,
          },
        }));
      },

      getColors: () => {
        const {currentPreset, customColors} = get();
        const preset = THEME_PRESETS.find((p) => p.id === currentPreset);

        if (!preset) return THEME_PRESETS[0].colors;

        return {
          ...preset.colors,
          ...customColors,
        };
      },

      getPresets: () => THEME_PRESETS,

      getCurrentPreset: () => {
        const {currentPreset} = get();
        return THEME_PRESETS.find((p) => p.id === currentPreset);
      },

      resetToDefault: () => {
        set({
          mode: 'light',
          currentPreset: 'default',
          customColors: {},
        });
      },
    }),
    {
      name: 'mindmaps-theme',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Hook to get current theme colors
export const useThemeColors = () => {
  const {mode, getColors} = useThemeStore();
  const baseColors = colors[mode];
  const presetColors = getColors();

  return {
    ...baseColors,
    ...presetColors,
  };
};
