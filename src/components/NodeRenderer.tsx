import React from 'react';
import {Canvas, Group, RoundedRect, Text as SkiaText, Shadow, Circle, Path} from '@shopify/react-native-skia';
import {Node, Edge} from '../types';
import {useFont} from '@shopify/react-native-skia';

export interface NodeRendererProps {
  nodes: Node[];
  edges: Edge[];
  width: number;
  height: number;
  translateX: number;
  translateY: number;
  scale: number;
  onNodePress?: (nodeId: string) => void;
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({
  nodes,
  edges,
  width,
  height,
  translateX,
  translateY,
  scale,
}) => {
  // Center canvas to origin
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <Canvas style={{width, height}}>
      <Group
        transform={[
          {translateX: centerX + translateX},
          {translateY: centerY + translateY},
          {scale},
        ]}
      >
        {/* Render edges first (under nodes) */}
        {edges.map(edge => {
          const fromNode = nodes.find(n => n.id === edge.fromNodeId);
          const toNode = nodes.find(n => n.id === edge.toNodeId);

          if (!fromNode || !toNode) return null;

          // Calculate path based on edge style
          let path = `M ${fromNode.x} ${fromNode.y} `;

          if (edge.style === 'curved') {
            // Bezier curve
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            const controlX = midX;
            const controlY = midY - 50; // Curve upward
            path += `Q ${controlX} ${controlY} ${toNode.x} ${toNode.y}`;
          } else {
            // Straight line
            path += `L ${toNode.x} ${toNode.y}`;
          }

          return (
            <Path
              key={edge.id}
              path={path}
              color={edge.color}
              style="stroke"
              strokeWidth={edge.width}
              strokeCap="round"
              strokeJoin="round"
              strokeDash={edge.style === 'dashed' ? [5, 5] : undefined}
            />
          );
        })}

        {/* Render nodes */}
        {nodes.map(node => {
          const nodeWidth = 120;
          const nodeHeight = 50;

          return (
            <Group key={node.id}>
              {/* Node shadow */}
              <RoundedRect
                x={node.x - nodeWidth / 2}
                y={node.y - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                r={12}
                color={node.color}
              >
                <Shadow dx={0} dy={4} blur={8} color="rgba(0,0,0,0.15)" />
              </RoundedRect>

              {/* Node text */}
              <SkiaText
                x={node.x}
                y={node.y}
                text={node.text}
                color="#FFFFFF"
                size={node.fontSize}
              />

              {/* Selection indicator (optional) */}
              {/* Could add circle or highlight based on selection state */}
            </Group>
          );
        })}
      </Group>
    </Canvas>
  );
};
