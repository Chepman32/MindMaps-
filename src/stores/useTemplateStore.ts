import {create} from 'zustand';
import {Template} from '../types';

const SAMPLE_TEMPLATES: Template[] = [
  {
    id: 'brainstorm',
    name: 'Brainstorming',
    description: 'Central idea with radial branches',
    thumbnail: 'brainstorm_thumb',
    category: 'General',
    isPro: false,
    structure: {
      nodes: [
        {id: 'center', text: 'Main Idea', x: 0, y: 0, color: '#007AFF', fontSize: 18},
        {id: 'branch1', text: 'Branch 1', x: 150, y: -100, color: '#34C759', fontSize: 14},
        {id: 'branch2', text: 'Branch 2', x: 150, y: 100, color: '#FF9500', fontSize: 14},
        {id: 'branch3', text: 'Branch 3', x: -150, y: -100, color: '#FF3B30', fontSize: 14},
        {id: 'branch4', text: 'Branch 4', x: -150, y: 100, color: '#5856D6', fontSize: 14},
      ],
      edges: [
        {id: 'e1', fromNodeId: 'center', toNodeId: 'branch1', style: 'curved', color: '#007AFF', width: 2},
        {id: 'e2', fromNodeId: 'center', toNodeId: 'branch2', style: 'curved', color: '#007AFF', width: 2},
        {id: 'e3', fromNodeId: 'center', toNodeId: 'branch3', style: 'curved', color: '#007AFF', width: 2},
        {id: 'e4', fromNodeId: 'center', toNodeId: 'branch4', style: 'curved', color: '#007AFF', width: 2},
      ],
    },
  },
  {
    id: 'project',
    name: 'Project Planning',
    description: 'Hierarchical project structure',
    thumbnail: 'project_thumb',
    category: 'Business',
    isPro: false,
    structure: {
      nodes: [
        {id: 'root', text: 'Project', x: 0, y: -150, color: '#007AFF', fontSize: 18},
        {id: 'phase1', text: 'Phase 1', x: -150, y: 0, color: '#34C759', fontSize: 14},
        {id: 'phase2', text: 'Phase 2', x: 0, y: 0, color: '#FF9500', fontSize: 14},
        {id: 'phase3', text: 'Phase 3', x: 150, y: 0, color: '#5856D6', fontSize: 14},
      ],
      edges: [
        {id: 'e1', fromNodeId: 'root', toNodeId: 'phase1', style: 'solid', color: '#007AFF', width: 2},
        {id: 'e2', fromNodeId: 'root', toNodeId: 'phase2', style: 'solid', color: '#007AFF', width: 2},
        {id: 'e3', fromNodeId: 'root', toNodeId: 'phase3', style: 'solid', color: '#007AFF', width: 2},
      ],
    },
  },
  {
    id: 'learning',
    name: 'Study Guide',
    description: 'Structured learning map',
    thumbnail: 'learning_thumb',
    category: 'Education',
    isPro: true,
    structure: {
      nodes: [
        {id: 'topic', text: 'Topic', x: 0, y: 0, color: '#5856D6', fontSize: 18},
        {id: 'concept1', text: 'Concept 1', x: -150, y: -80, color: '#34C759', fontSize: 14},
        {id: 'concept2', text: 'Concept 2', x: 150, y: -80, color: '#FF9500', fontSize: 14},
        {id: 'example1', text: 'Example', x: -150, y: 80, color: '#FF3B30', fontSize: 12},
        {id: 'example2', text: 'Example', x: 150, y: 80, color: '#FF3B30', fontSize: 12},
      ],
      edges: [
        {id: 'e1', fromNodeId: 'topic', toNodeId: 'concept1', style: 'curved', color: '#5856D6', width: 2},
        {id: 'e2', fromNodeId: 'topic', toNodeId: 'concept2', style: 'curved', color: '#5856D6', width: 2},
        {id: 'e3', fromNodeId: 'concept1', toNodeId: 'example1', style: 'dashed', color: '#34C759', width: 1},
        {id: 'e4', fromNodeId: 'concept2', toNodeId: 'example2', style: 'dashed', color: '#FF9500', width: 1},
      ],
    },
  },
];

interface TemplateState {
  templates: Template[];
  selectedCategory: string;

  getTemplates: () => Template[];
  getTemplateById: (id: string) => Template | undefined;
  getTemplatesByCategory: (category: string) => Template[];
  setSelectedCategory: (category: string) => void;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: SAMPLE_TEMPLATES,
  selectedCategory: 'All',

  getTemplates: () => get().templates,

  getTemplateById: (id: string) => {
    return get().templates.find(t => t.id === id);
  },

  getTemplatesByCategory: (category: string) => {
    const {templates} = get();
    if (category === 'All') return templates;
    return templates.filter(t => t.category === category);
  },

  setSelectedCategory: (category: string) => {
    set({selectedCategory: category});
  },
}));
