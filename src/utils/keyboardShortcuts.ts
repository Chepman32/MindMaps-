import {useEffect} from 'react';
import {Platform, Keyboard} from 'react-native';

export interface KeyboardShortcut {
  key: string;
  modifiers?: ('cmd' | 'ctrl' | 'shift' | 'alt')[];
  action: () => void;
  description: string;
}

class KeyboardShortcutManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();

  register(id: string, shortcut: KeyboardShortcut) {
    this.shortcuts.set(id, shortcut);
  }

  unregister(id: string) {
    this.shortcuts.delete(id);
  }

  handleKeyPress(event: any) {
    const key = event.key.toLowerCase();
    const modifiers: string[] = [];

    if (event.metaKey || event.ctrlKey) modifiers.push('cmd');
    if (event.shiftKey) modifiers.push('shift');
    if (event.altKey) modifiers.push('alt');

    // Find matching shortcut
    for (const [id, shortcut] of this.shortcuts.entries()) {
      if (shortcut.key.toLowerCase() === key) {
        const requiredMods = shortcut.modifiers || [];
        const hasAllMods = requiredMods.every((mod) => modifiers.includes(mod));
        const hasExtraMods = modifiers.some((mod) => !requiredMods.includes(mod as any));

        if (hasAllMods && !hasExtraMods) {
          event.preventDefault();
          shortcut.action();
          return;
        }
      }
    }
  }

  getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }
}

export const keyboardShortcutManager = new KeyboardShortcutManager();

// Hook to register keyboard shortcuts
export const useKeyboardShortcut = (
  id: string,
  shortcut: KeyboardShortcut
) => {
  useEffect(() => {
    keyboardShortcutManager.register(id, shortcut);

    return () => {
      keyboardShortcutManager.unregister(id);
    };
  }, [id, shortcut]);
};

// Common shortcuts
export const COMMON_SHORTCUTS = {
  NEW_MAP: {
    key: 'n',
    modifiers: ['cmd' as const],
    description: 'Create new map',
  },
  SAVE: {
    key: 's',
    modifiers: ['cmd' as const],
    description: 'Save current map',
  },
  UNDO: {
    key: 'z',
    modifiers: ['cmd' as const],
    description: 'Undo last action',
  },
  REDO: {
    key: 'z',
    modifiers: ['cmd' as const, 'shift' as const],
    description: 'Redo last action',
  },
  DELETE: {
    key: 'Backspace',
    modifiers: [],
    description: 'Delete selected item',
  },
  SELECT_ALL: {
    key: 'a',
    modifiers: ['cmd' as const],
    description: 'Select all nodes',
  },
  SEARCH: {
    key: 'f',
    modifiers: ['cmd' as const],
    description: 'Search',
  },
  EXPORT: {
    key: 'e',
    modifiers: ['cmd' as const],
    description: 'Export map',
  },
};

// Initialize keyboard listener
if (Platform.OS === 'web') {
  if (typeof document !== 'undefined') {
    document.addEventListener('keydown', (e) => {
      keyboardShortcutManager.handleKeyPress(e);
    });
  }
}
