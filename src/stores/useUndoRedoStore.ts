import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';

export interface HistoryAction {
  type: string;
  payload: any;
  timestamp: number;
}

interface UndoRedoState {
  history: HistoryAction[];
  currentIndex: number;
  maxHistorySize: number;

  // Actions
  addAction: (action: HistoryAction) => void;
  undo: () => HistoryAction | null;
  redo: () => HistoryAction | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clear: () => void;
  getHistory: () => HistoryAction[];
}

export const useUndoRedoStore = create<UndoRedoState>()(
  immer((set, get) => ({
    history: [],
    currentIndex: -1,
    maxHistorySize: 50,

    addAction: (action) => {
      set((state) => {
        // Remove any actions after current index (for branching history)
        state.history = state.history.slice(0, state.currentIndex + 1);

        // Add new action
        state.history.push({
          ...action,
          timestamp: Date.now(),
        });

        // Limit history size
        if (state.history.length > state.maxHistorySize) {
          state.history.shift();
        } else {
          state.currentIndex++;
        }
      });
    },

    undo: () => {
      const {history, currentIndex} = get();

      if (currentIndex < 0) return null;

      const action = history[currentIndex];

      set((state) => {
        state.currentIndex--;
      });

      return action;
    },

    redo: () => {
      const {history, currentIndex} = get();

      if (currentIndex >= history.length - 1) return null;

      set((state) => {
        state.currentIndex++;
      });

      return history[currentIndex + 1];
    },

    canUndo: () => {
      return get().currentIndex >= 0;
    },

    canRedo: () => {
      const {history, currentIndex} = get();
      return currentIndex < history.length - 1;
    },

    clear: () => {
      set((state) => {
        state.history = [];
        state.currentIndex = -1;
      });
    },

    getHistory: () => {
      return get().history;
    },
  }))
);

// Utility to create reversible actions
export const createReversibleAction = (
  type: string,
  forward: () => void,
  backward: () => void
) => {
  return {
    type,
    forward,
    backward,
    timestamp: Date.now(),
  };
};
