import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {Map, Node, Edge} from '../types';
import {nanoid} from 'nanoid/non-secure';

interface MapState {
  maps: Map[];
  currentMapId: string | null;
  nodes: Record<string, Node[]>;
  edges: Record<string, Edge[]>;

  // Actions
  createMap: (title: string) => string;
  deleteMap: (id: string) => void;
  updateMap: (id: string, updates: Partial<Map>) => void;
  setCurrentMap: (id: string | null) => void;

  // Node actions
  addNode: (mapId: string, node: Omit<Node, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNode: (mapId: string, nodeId: string, updates: Partial<Node>) => void;
  deleteNode: (mapId: string, nodeId: string) => void;

  // Edge actions
  addEdge: (mapId: string, edge: Omit<Edge, 'id'>) => string;
  updateEdge: (mapId: string, edgeId: string, updates: Partial<Edge>) => void;
  deleteEdge: (mapId: string, edgeId: string) => void;

  // Getters
  getCurrentMap: () => Map | null;
  getCurrentNodes: () => Node[];
  getCurrentEdges: () => Edge[];
}

export const useMapStore = create<MapState>()(
  immer((set, get) => ({
    maps: [],
    currentMapId: null,
    nodes: {},
    edges: {},

    createMap: (title: string) => {
      const id = nanoid();
      const now = new Date().toISOString();

      set(state => {
        state.maps.push({
          id,
          title,
          createdAt: now,
          updatedAt: now,
          nodeCount: 0,
          offline: true,
        });
        state.nodes[id] = [];
        state.edges[id] = [];
      });

      return id;
    },

    deleteMap: (id: string) => {
      set(state => {
        state.maps = state.maps.filter(m => m.id !== id);
        delete state.nodes[id];
        delete state.edges[id];
        if (state.currentMapId === id) {
          state.currentMapId = null;
        }
      });
    },

    updateMap: (id: string, updates: Partial<Map>) => {
      set(state => {
        const map = state.maps.find(m => m.id === id);
        if (map) {
          Object.assign(map, updates);
          map.updatedAt = new Date().toISOString();
        }
      });
    },

    setCurrentMap: (id: string | null) => {
      set(state => {
        state.currentMapId = id;
      });
    },

    addNode: (mapId: string, node) => {
      const id = nanoid();
      const now = new Date().toISOString();

      set(state => {
        if (!state.nodes[mapId]) {
          state.nodes[mapId] = [];
        }

        state.nodes[mapId].push({
          ...node,
          id,
          mapId,
          createdAt: now,
          updatedAt: now,
        });

        const map = state.maps.find(m => m.id === mapId);
        if (map) {
          map.nodeCount = state.nodes[mapId].length;
          map.updatedAt = now;
        }
      });

      return id;
    },

    updateNode: (mapId: string, nodeId: string, updates) => {
      set(state => {
        const node = state.nodes[mapId]?.find(n => n.id === nodeId);
        if (node) {
          Object.assign(node, updates);
          node.updatedAt = new Date().toISOString();
        }
      });
    },

    deleteNode: (mapId: string, nodeId: string) => {
      set(state => {
        if (state.nodes[mapId]) {
          state.nodes[mapId] = state.nodes[mapId].filter(n => n.id !== nodeId);

          const map = state.maps.find(m => m.id === mapId);
          if (map) {
            map.nodeCount = state.nodes[mapId].length;
            map.updatedAt = new Date().toISOString();
          }
        }

        // Delete connected edges
        if (state.edges[mapId]) {
          state.edges[mapId] = state.edges[mapId].filter(
            e => e.fromNodeId !== nodeId && e.toNodeId !== nodeId
          );
        }
      });
    },

    addEdge: (mapId: string, edge) => {
      const id = nanoid();

      set(state => {
        if (!state.edges[mapId]) {
          state.edges[mapId] = [];
        }

        state.edges[mapId].push({
          ...edge,
          id,
        });
      });

      return id;
    },

    updateEdge: (mapId: string, edgeId: string, updates) => {
      set(state => {
        const edge = state.edges[mapId]?.find(e => e.id === edgeId);
        if (edge) {
          Object.assign(edge, updates);
        }
      });
    },

    deleteEdge: (mapId: string, edgeId: string) => {
      set(state => {
        if (state.edges[mapId]) {
          state.edges[mapId] = state.edges[mapId].filter(e => e.id !== edgeId);
        }
      });
    },

    getCurrentMap: () => {
      const {maps, currentMapId} = get();
      return maps.find(m => m.id === currentMapId) || null;
    },

    getCurrentNodes: () => {
      const {nodes, currentMapId} = get();
      return currentMapId ? nodes[currentMapId] || [] : [];
    },

    getCurrentEdges: () => {
      const {edges, currentMapId} = get();
      return currentMapId ? edges[currentMapId] || [] : [];
    },
  }))
);
