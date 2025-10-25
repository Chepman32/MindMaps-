import {GestureType} from '../types';

export const GESTURE_CONFIGS = {
  tap: {
    maxDurationMs: 250,
    maxDistance: 10,
  },
  doubleTap: {
    maxDelay: 300,
    maxDistance: 20,
  },
  longPress: {
    minDurationMs: 500,
    maxDistance: 10,
  },
  pressAndHold: {
    minDurationMs: 300,
  },
  pan: {
    activeOffsetX: [-10, 10],
    activeOffsetY: [-10, 10],
    failOffsetX: [-5, 5],
    failOffsetY: [-5, 5],
  },
  pinch: {
    minPointers: 2,
    minDistance: 20,
  },
  edgeSwipe: {
    edgeWidth: 50,
    minVelocity: 500,
  },
};

export const getGestureHitSlop = (gestureType: GestureType) => {
  switch (gestureType) {
    case 'tap':
    case 'doubleTap':
      return {top: 12, bottom: 12, left: 12, right: 12};
    case 'longPress':
    case 'pressAndHold':
      return {top: 16, bottom: 16, left: 16, right: 16};
    default:
      return {top: 8, bottom: 8, left: 8, right: 8};
  }
};

export const isGestureWithinBounds = (
  x: number,
  y: number,
  bounds: {x: number; y: number; width: number; height: number}
) => {
  return (
    x >= bounds.x &&
    x <= bounds.x + bounds.width &&
    y >= bounds.y &&
    y <= bounds.y + bounds.height
  );
};

export const calculateGestureVelocity = (
  positions: {x: number; y: number; timestamp: number}[]
) => {
  if (positions.length < 2) return {x: 0, y: 0};

  const last = positions[positions.length - 1];
  const first = positions[0];
  const deltaTime = (last.timestamp - first.timestamp) / 1000; // Convert to seconds

  if (deltaTime === 0) return {x: 0, y: 0};

  return {
    x: (last.x - first.x) / deltaTime,
    y: (last.y - first.y) / deltaTime,
  };
};

export const normalizeGestureValue = (
  value: number,
  min: number,
  max: number
) => {
  return Math.max(min, Math.min(max, value));
};

export const calculatePinchScale = (
  initialDistance: number,
  currentDistance: number
) => {
  if (initialDistance === 0) return 1;
  return currentDistance / initialDistance;
};

export const calculatePinchCenter = (
  touch1: {x: number; y: number},
  touch2: {x: number; y: number}
) => {
  return {
    x: (touch1.x + touch2.x) / 2,
    y: (touch1.y + touch2.y) / 2,
  };
};
