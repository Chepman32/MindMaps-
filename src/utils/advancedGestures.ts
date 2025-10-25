import {Gesture} from 'react-native-gesture-handler';
import {SharedValue, runOnJS} from 'react-native-reanimated';

/**
 * Multi-finger tap gesture (e.g., two-finger tap for context menu)
 */
export const createMultiFingerTap = (
  fingers: number,
  onTap: () => void
) => {
  return Gesture.Tap()
    .numberOfTaps(1)
    .minPointers(fingers)
    .maxPointers(fingers)
    .onEnd(() => {
      runOnJS(onTap)();
    });
};

/**
 * Long press with threshold
 */
export const createLongPressWithThreshold = (
  onLongPress: (x: number, y: number) => void,
  duration: number = 500
) => {
  return Gesture.LongPress()
    .minDuration(duration)
    .onStart((event) => {
      runOnJS(onLongPress)(event.x, event.y);
    });
};

/**
 * Swipe gesture with velocity threshold
 */
export const createSwipeGesture = (
  direction: 'up' | 'down' | 'left' | 'right',
  onSwipe: () => void,
  velocityThreshold: number = 500
) => {
  return Gesture.Fling()
    .direction(
      direction === 'up'
        ? 1
        : direction === 'down'
        ? 2
        : direction === 'left'
        ? 4
        : 8
    )
    .onEnd(() => {
      runOnJS(onSwipe)();
    });
};

/**
 * Pinch to zoom with constraints
 */
export const createConstrainedPinch = (
  scale: SharedValue<number>,
  minScale: number = 0.5,
  maxScale: number = 3
) => {
  const savedScale = {value: 1};

  return Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.max(minScale, Math.min(maxScale, newScale));
    });
};

/**
 * Rotation gesture
 */
export const createRotationGesture = (
  rotation: SharedValue<number>,
  onRotationEnd?: (angle: number) => void
) => {
  const savedRotation = {value: 0};

  return Gesture.Rotation()
    .onStart(() => {
      savedRotation.value = rotation.value;
    })
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      if (onRotationEnd) {
        runOnJS(onRotationEnd)(rotation.value);
      }
    });
};

/**
 * Pan with snap points
 */
export const createPanWithSnapPoints = (
  translateX: SharedValue<number>,
  translateY: SharedValue<number>,
  snapPoints: {x: number[]; y: number[]}
) => {
  const savedTranslateX = {value: 0};
  const savedTranslateY = {value: 0};

  const findNearestSnapPoint = (value: number, points: number[]) => {
    return points.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  };

  return Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      // Snap to nearest point
      if (snapPoints.x.length > 0) {
        translateX.value = findNearestSnapPoint(translateX.value, snapPoints.x);
      }
      if (snapPoints.y.length > 0) {
        translateY.value = findNearestSnapPoint(translateY.value, snapPoints.y);
      }
    });
};

/**
 * Double tap to reset
 */
export const createDoubleTapReset = (
  scale: SharedValue<number>,
  translateX: SharedValue<number>,
  translateY: SharedValue<number>
) => {
  return Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      'worklet';
      scale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
    });
};

/**
 * Edge swipe (from screen edge)
 */
export const createEdgeSwipe = (
  edge: 'left' | 'right' | 'top' | 'bottom',
  onSwipe: () => void,
  edgeWidth: number = 50
) => {
  return Gesture.Pan()
    .onStart((event) => {
      let isFromEdge = false;

      switch (edge) {
        case 'left':
          isFromEdge = event.x < edgeWidth;
          break;
        case 'right':
          isFromEdge = event.x > event.absoluteX - edgeWidth;
          break;
        case 'top':
          isFromEdge = event.y < edgeWidth;
          break;
        case 'bottom':
          isFromEdge = event.y > event.absoluteY - edgeWidth;
          break;
      }

      if (isFromEdge) {
        runOnJS(onSwipe)();
      }
    });
};

/**
 * Combo gesture: Simultaneous pan + pinch
 */
export const createPanPinchCombo = (
  translateX: SharedValue<number>,
  translateY: SharedValue<number>,
  scale: SharedValue<number>
) => {
  const savedTranslateX = {value: 0};
  const savedTranslateY = {value: 0};
  const savedScale = {value: 1};

  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    });

  return Gesture.Simultaneous(panGesture, pinchGesture);
};

/**
 * Force touch simulation (long press with pressure)
 */
export const createForceTouch = (
  onForceTouch: (force: number) => void,
  threshold: number = 0.5
) => {
  return Gesture.LongPress()
    .minDuration(300)
    .onStart((event) => {
      // Note: Real force touch requires native implementation
      // This is a simulation based on duration
      runOnJS(onForceTouch)(1);
    });
};
