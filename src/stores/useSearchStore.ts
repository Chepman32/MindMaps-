import {create} from 'zustand';
import {Map, Node} from '../types';

interface SearchState {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  filters: SearchFilters;

  // Actions
  setQuery: (query: string) => void;
  search: (maps: Map[], allNodes: Record<string, Node[]>) => void;
  clearSearch: () => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
}

export interface SearchResult {
  type: 'map' | 'node';
  id: string;
  mapId: string;
  title: string;
  preview: string;
  matchedText: string;
  score: number;
}

export interface SearchFilters {
  searchMaps: boolean;
  searchNodes: boolean;
  caseSensitive: boolean;
  wholeWord: boolean;
}

const DEFAULT_FILTERS: SearchFilters = {
  searchMaps: true,
  searchNodes: true,
  caseSensitive: false,
  wholeWord: false,
};

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  isSearching: false,
  filters: DEFAULT_FILTERS,

  setQuery: (query) => {
    set({query});
  },

  search: (maps, allNodes) => {
    const {query, filters} = get();

    if (!query.trim()) {
      set({results: []});
      return;
    }

    set({isSearching: true});

    const results: SearchResult[] = [];
    const searchTerm = filters.caseSensitive ? query : query.toLowerCase();

    // Search maps
    if (filters.searchMaps) {
      maps.forEach((map) => {
        const title = filters.caseSensitive ? map.title : map.title.toLowerCase();

        if (matchesQuery(title, searchTerm, filters.wholeWord)) {
          results.push({
            type: 'map',
            id: map.id,
            mapId: map.id,
            title: map.title,
            preview: `${map.nodeCount} nodes`,
            matchedText: map.title,
            score: calculateScore(title, searchTerm),
          });
        }
      });
    }

    // Search nodes
    if (filters.searchNodes) {
      Object.entries(allNodes).forEach(([mapId, nodes]) => {
        const map = maps.find((m) => m.id === mapId);

        nodes.forEach((node) => {
          const text = filters.caseSensitive ? node.text : node.text.toLowerCase();

          if (matchesQuery(text, searchTerm, filters.wholeWord)) {
            results.push({
              type: 'node',
              id: node.id,
              mapId,
              title: node.text,
              preview: map?.title || 'Unknown Map',
              matchedText: node.text,
              score: calculateScore(text, searchTerm),
            });
          }
        });
      });
    }

    // Sort by score (relevance)
    results.sort((a, b) => b.score - a.score);

    set({results, isSearching: false});
  },

  clearSearch: () => {
    set({query: '', results: []});
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: {...state.filters, ...newFilters},
    }));
  },
}));

// Helper functions
const matchesQuery = (text: string, query: string, wholeWord: boolean): boolean => {
  if (wholeWord) {
    const regex = new RegExp(`\\b${escapeRegex(query)}\\b`, 'i');
    return regex.test(text);
  }
  return text.includes(query);
};

const calculateScore = (text: string, query: string): number => {
  // Simple scoring: exact match = 100, starts with = 80, contains = 50
  if (text === query) return 100;
  if (text.startsWith(query)) return 80;
  if (text.includes(query)) return 50;
  return 0;
};

const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
