import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {AppSettings} from '../types';
import {useColorScheme} from 'react-native';

interface SettingsState extends AppSettings {
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  getCurrentTheme: () => 'light' | 'dark';
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  dynamicType: true,
  haptics: true,
  animations: true,
  autoSave: true,
  defaultMapStyle: 'radial',
  isPro: false,
};

export const useSettingsStore = create<SettingsState>()(
  immer((set, get) => ({
    ...DEFAULT_SETTINGS,

    updateSettings: (updates) => {
      set(state => {
        Object.assign(state, updates);
      });
    },

    resetSettings: () => {
      set(DEFAULT_SETTINGS);
    },

    getCurrentTheme: () => {
      const {theme} = get();
      if (theme === 'system') {
        const colorScheme = useColorScheme();
        return colorScheme || 'light';
      }
      return theme;
    },
  }))
);
