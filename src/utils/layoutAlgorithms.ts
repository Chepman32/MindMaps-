import {Node} from '../types';

export interface LayoutAlgorithm {
  name: string;
  description: string;
  layout: (nodes: Node[], rootId?: string) => Node[];
}

/**
 * Radial layout: Places nodes in a circle around the root
 */
export const radialLayout: LayoutAlgorithm = {
  name: 'Radial',
  description: 'Circular layout around central node',
  layout: (nodes, rootId) => {
    if (nodes.length === 0) return nodes;

    const root = rootId ? nodes.find((n) => n.id === rootId) : nodes[0];
    if (!root) return nodes;

    const children = nodes.filter((n) => n.id !== root.id);
    const radius = 200;
    const angleStep = (2 * Math.PI) / children.length;

    const layoutNodes = [...nodes];
    const rootIndex = layoutNodes.findIndex((n) => n.id === root.id);

    // Center root
    if (rootIndex !== -1) {
      layoutNodes[rootIndex] = {...root, x: 0, y: 0};
    }

    // Position children in circle
    children.forEach((node, index) => {
      const angle = index * angleStep;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const nodeIndex = layoutNodes.findIndex((n) => n.id === node.id);
      if (nodeIndex !== -1) {
        layoutNodes[nodeIndex] = {...node, x, y};
      }
    });

    return layoutNodes;
  },
};

/**
 * Tree layout: Hierarchical tree structure
 */
export const treeLayout: LayoutAlgorithm = {
  name: 'Tree',
  description: 'Hierarchical tree structure',
  layout: (nodes, rootId) => {
    if (nodes.length === 0) return nodes;

    const root = rootId ? nodes.find((n) => n.id === rootId) : nodes[0];
    if (!root) return nodes;

    const layoutNodes = [...nodes];
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    // Build hierarchy
    const hierarchy = buildHierarchy(nodes, root.id);

    // Position nodes
    const levelHeight = 150;
    const siblingSpacing = 120;

    const positionNode = (
      node: Node,
      level: number,
      position: number,
      parentX: number = 0
    ) => {
      const x = parentX + (position - 0.5) * siblingSpacing;
      const y = level * levelHeight;

      const nodeIndex = layoutNodes.findIndex((n) => n.id === node.id);
      if (nodeIndex !== -1) {
        layoutNodes[nodeIndex] = {...node, x, y};
      }

      // Position children
      const children = nodes.filter((n) => n.parentId === node.id);
      children.forEach((child, index) => {
        positionNode(child, level + 1, index, x);
      });
    };

    positionNode(root, 0, 0);

    return layoutNodes;
  },
};

/**
 * Force-directed layout: Physics-based automatic layout
 */
export const forceDirectedLayout: LayoutAlgorithm = {
  name: 'Force-Directed',
  description: 'Physics-based automatic positioning',
  layout: (nodes) => {
    if (nodes.length === 0) return nodes;

    const layoutNodes = nodes.map((n) => ({
      ...n,
      vx: 0,
      vy: 0,
    }));

    const iterations = 100;
    const repulsionStrength = 5000;
    const attractionStrength = 0.1;
    const damping = 0.8;

    for (let iter = 0; iter < iterations; iter++) {
      // Apply repulsion between all nodes
      for (let i = 0; i < layoutNodes.length; i++) {
        for (let j = i + 1; j < layoutNodes.length; j++) {
          const dx = layoutNodes[j].x - layoutNodes[i].x;
          const dy = layoutNodes[j].y - layoutNodes[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;

          const force = repulsionStrength / (distance * distance);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;

          (layoutNodes[i] as any).vx -= fx;
          (layoutNodes[i] as any).vy -= fy;
          (layoutNodes[j] as any).vx += fx;
          (layoutNodes[j] as any).vy += fy;
        }
      }

      // Apply attraction for connected nodes (parent-child)
      layoutNodes.forEach((node, i) => {
        if (node.parentId) {
          const parent = layoutNodes.find((n) => n.id === node.parentId);
          if (parent) {
            const dx = parent.x - node.x;
            const dy = parent.y - node.y;

            (layoutNodes[i] as any).vx += dx * attractionStrength;
            (layoutNodes[i] as any).vy += dy * attractionStrength;
          }
        }
      });

      // Update positions
      layoutNodes.forEach((node, i) => {
        layoutNodes[i].x += (node as any).vx;
        layoutNodes[i].y += (node as any).vy;
        (layoutNodes[i] as any).vx *= damping;
        (layoutNodes[i] as any).vy *= damping;
      });
    }

    // Remove velocity properties
    return layoutNodes.map(({vx, vy, ...node}: any) => node);
  },
};

/**
 * Grid layout: Organizes nodes in a grid
 */
export const gridLayout: LayoutAlgorithm = {
  name: 'Grid',
  description: 'Organized grid layout',
  layout: (nodes) => {
    if (nodes.length === 0) return nodes;

    const columns = Math.ceil(Math.sqrt(nodes.length));
    const spacing = 150;

    return nodes.map((node, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);

      return {
        ...node,
        x: col * spacing - (columns * spacing) / 2,
        y: row * spacing,
      };
    });
  },
};

// Helper function to build hierarchy
const buildHierarchy = (nodes: Node[], rootId: string) => {
  const nodeMap = new Map(nodes.map((n) => [n.id, {...n, children: []}]));

  nodes.forEach((node) => {
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      const child = nodeMap.get(node.id);
      if (parent && child) {
        (parent as any).children.push(child);
      }
    }
  });

  return nodeMap.get(rootId);
};

// Export all layouts
export const LAYOUT_ALGORITHMS = [
  radialLayout,
  treeLayout,
  forceDirectedLayout,
  gridLayout,
];

export const getLayoutByName = (name: string): LayoutAlgorithm | undefined => {
  return LAYOUT_ALGORITHMS.find((layout) => layout.name === name);
};
