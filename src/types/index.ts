export interface Map {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  thumbnail?: string;
  offline: boolean;
}

export interface Node {
  id: string;
  mapId: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  icon?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Edge {
  id: string;
  mapId: string;
  fromNodeId: string;
  toNodeId: string;
  style: 'solid' | 'dashed' | 'curved';
  color: string;
  width: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  structure: TemplateStructure;
  category: string;
  isPro: boolean;
}

export interface TemplateStructure {
  nodes: Omit<Node, 'mapId' | 'createdAt' | 'updatedAt'>[];
  edges: Omit<Edge, 'mapId'>[];
}

export interface OutlineItem {
  id: string;
  text: string;
  level: number;
  nodeId: string;
  children: OutlineItem[];
  collapsed: boolean;
}

export interface IAPProduct {
  productId: string;
  price: string;
  currency: string;
  title: string;
  description: string;
  type: 'subscription' | 'non-consumable';
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  dynamicType: boolean;
  haptics: boolean;
  animations: boolean;
  autoSave: boolean;
  defaultMapStyle: string;
  isPro: boolean;
}

export type GestureType =
  | 'tap'
  | 'doubleTap'
  | 'longPress'
  | 'pressAndHold'
  | 'pan'
  | 'drag'
  | 'pinch'
  | 'hover'
  | 'scroll'
  | 'fling'
  | 'edgeSwipe';

export type AnimationHook =
  | 'onFocusTransition'
  | 'onPressScaleSpring'
  | 'onDismissSwipe'
  | 'onRevealFling';

export interface ComponentProps {
  prop1?: string | number | boolean;
  prop2?: string | number | boolean;
  prop3?: string | number | boolean;
  prop4?: string | number | boolean;
  prop5?: string | number | boolean;
  prop6?: string | number | boolean;
  prop7?: string | number | boolean;
  prop8?: string | number | boolean;
}

export interface MotionConfig {
  duration: number;
  stiffness: number;
  damping: number;
  easing: 'spring' | 'timing' | 'decay';
}
