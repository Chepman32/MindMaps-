import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Map, Node, Edge} from '../types';

interface PersistenceState {
  isInitialized: boolean;
  lastSync: string | null;

  // Actions
  initializeDatabase: () => Promise<void>;
  saveMaps: (maps: Map[]) => Promise<void>;
  loadMaps: () => Promise<Map[]>;
  saveNodes: (mapId: string, nodes: Node[]) => Promise<void>;
  loadNodes: (mapId: string) => Promise<Node[]>;
  saveEdges: (mapId: string, edges: Edge[]) => Promise<void>;
  loadEdges: (mapId: string) => Promise<Edge[]>;
  clearAll: () => Promise<void>;
  exportBackup: () => Promise<string>;
  importBackup: (data: string) => Promise<void>;
}

export const usePersistenceStore = create<PersistenceState>()(
  persist(
    (set, get) => ({
      isInitialized: false,
      lastSync: null,

      initializeDatabase: async () => {
        try {
          // Check if data exists
          const existing = await AsyncStorage.getItem('mindmaps_initialized');

          if (!existing) {
            // Initialize with empty data
            await AsyncStorage.setItem('mindmaps_maps', JSON.stringify([]));
            await AsyncStorage.setItem('mindmaps_initialized', 'true');
          }

          set({isInitialized: true, lastSync: new Date().toISOString()});
        } catch (error) {
          console.error('Failed to initialize database:', error);
        }
      },

      saveMaps: async (maps) => {
        try {
          await AsyncStorage.setItem('mindmaps_maps', JSON.stringify(maps));
          set({lastSync: new Date().toISOString()});
        } catch (error) {
          console.error('Failed to save maps:', error);
        }
      },

      loadMaps: async () => {
        try {
          const data = await AsyncStorage.getItem('mindmaps_maps');
          return data ? JSON.parse(data) : [];
        } catch (error) {
          console.error('Failed to load maps:', error);
          return [];
        }
      },

      saveNodes: async (mapId, nodes) => {
        try {
          await AsyncStorage.setItem(
            `mindmaps_nodes_${mapId}`,
            JSON.stringify(nodes)
          );
          set({lastSync: new Date().toISOString()});
        } catch (error) {
          console.error('Failed to save nodes:', error);
        }
      },

      loadNodes: async (mapId) => {
        try {
          const data = await AsyncStorage.getItem(`mindmaps_nodes_${mapId}`);
          return data ? JSON.parse(data) : [];
        } catch (error) {
          console.error('Failed to load nodes:', error);
          return [];
        }
      },

      saveEdges: async (mapId, edges) => {
        try {
          await AsyncStorage.setItem(
            `mindmaps_edges_${mapId}`,
            JSON.stringify(edges)
          );
          set({lastSync: new Date().toISOString()});
        } catch (error) {
          console.error('Failed to save edges:', error);
        }
      },

      loadEdges: async (mapId) => {
        try {
          const data = await AsyncStorage.getItem(`mindmaps_edges_${mapId}`);
          return data ? JSON.parse(data) : [];
        } catch (error) {
          console.error('Failed to load edges:', error);
          return [];
        }
      },

      clearAll: async () => {
        try {
          await AsyncStorage.clear();
          set({isInitialized: false, lastSync: null});
        } catch (error) {
          console.error('Failed to clear data:', error);
        }
      },

      exportBackup: async () => {
        try {
          const maps = await get().loadMaps();
          const allData: any = {maps, nodes: {}, edges: {}};

          for (const map of maps) {
            allData.nodes[map.id] = await get().loadNodes(map.id);
            allData.edges[map.id] = await get().loadEdges(map.id);
          }

          return JSON.stringify({
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: allData,
          });
        } catch (error) {
          console.error('Failed to export backup:', error);
          throw error;
        }
      },

      importBackup: async (data) => {
        try {
          const backup = JSON.parse(data);

          if (backup.version !== '1.0') {
            throw new Error('Unsupported backup version');
          }

          // Save maps
          await get().saveMaps(backup.data.maps);

          // Save nodes and edges
          for (const mapId in backup.data.nodes) {
            await get().saveNodes(mapId, backup.data.nodes[mapId]);
            await get().saveEdges(mapId, backup.data.edges[mapId]);
          }

          set({lastSync: new Date().toISOString()});
        } catch (error) {
          console.error('Failed to import backup:', error);
          throw error;
        }
      },
    }),
    {
      name: 'mindmaps-persistence',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Auto-save hook
export const useAutoSave = (
  maps: Map[],
  nodes: Record<string, Node[]>,
  edges: Record<string, Edge[]>,
  interval: number = 30000 // 30 seconds
) => {
  React.useEffect(() => {
    const {saveMaps, saveNodes, saveEdges} = usePersistenceStore.getState();

    const save = async () => {
      await saveMaps(maps);

      for (const mapId in nodes) {
        await saveNodes(mapId, nodes[mapId]);
        await saveEdges(mapId, edges[mapId]);
      }
    };

    // Initial save
    save();

    // Set up interval
    const intervalId = setInterval(save, interval);

    return () => clearInterval(intervalId);
  }, [maps, nodes, edges, interval]);
};
