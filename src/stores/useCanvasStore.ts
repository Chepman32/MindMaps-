import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';

interface CanvasState {
  // Transform
  translateX: number;
  translateY: number;
  scale: number;

  // Selection
  selectedNodeIds: string[];
  selectedEdgeIds: string[];

  // Canvas state
  isPanning: boolean;
  isZooming: boolean;
  isDraggingNode: boolean;

  // Actions
  setTransform: (translateX: number, translateY: number, scale: number) => void;
  resetTransform: () => void;
  selectNode: (nodeId: string, multiSelect?: boolean) => void;
  selectEdge: (edgeId: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  setCanvasState: (updates: Partial<Omit<CanvasState, keyof Actions>>) => void;
}

type Actions = {
  setTransform: Function;
  resetTransform: Function;
  selectNode: Function;
  selectEdge: Function;
  clearSelection: Function;
  setCanvasState: Function;
};

export const useCanvasStore = create<CanvasState>()(
  immer((set) => ({
    translateX: 0,
    translateY: 0,
    scale: 1,
    selectedNodeIds: [],
    selectedEdgeIds: [],
    isPanning: false,
    isZooming: false,
    isDraggingNode: false,

    setTransform: (translateX, translateY, scale) => {
      set(state => {
        state.translateX = translateX;
        state.translateY = translateY;
        state.scale = Math.max(0.1, Math.min(5, scale));
      });
    },

    resetTransform: () => {
      set(state => {
        state.translateX = 0;
        state.translateY = 0;
        state.scale = 1;
      });
    },

    selectNode: (nodeId, multiSelect = false) => {
      set(state => {
        if (multiSelect) {
          if (state.selectedNodeIds.includes(nodeId)) {
            state.selectedNodeIds = state.selectedNodeIds.filter(id => id !== nodeId);
          } else {
            state.selectedNodeIds.push(nodeId);
          }
        } else {
          state.selectedNodeIds = [nodeId];
        }
        state.selectedEdgeIds = [];
      });
    },

    selectEdge: (edgeId, multiSelect = false) => {
      set(state => {
        if (multiSelect) {
          if (state.selectedEdgeIds.includes(edgeId)) {
            state.selectedEdgeIds = state.selectedEdgeIds.filter(id => id !== edgeId);
          } else {
            state.selectedEdgeIds.push(edgeId);
          }
        } else {
          state.selectedEdgeIds = [edgeId];
        }
        state.selectedNodeIds = [];
      });
    },

    clearSelection: () => {
      set(state => {
        state.selectedNodeIds = [];
        state.selectedEdgeIds = [];
      });
    },

    setCanvasState: (updates) => {
      set(state => {
        Object.assign(state, updates);
      });
    },
  }))
);
