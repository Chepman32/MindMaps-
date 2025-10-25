import React from 'react';
import {View, StyleSheet, AccessibilityProps} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Canvas, RoundedRect, Shadow, LinearGradient, vec} from '@shopify/react-native-skia';
import {ComponentProps, GestureType, AnimationHook} from '../../types';
import {MOTION_CONFIGS} from '../../utils/animations';
import {getGestureHitSlop} from '../../utils/gestures';

export interface BaseComponentProps extends ComponentProps, AccessibilityProps {
  gestures?: GestureType[];
  animationHooks?: AnimationHook[];
  useSkia?: boolean;
  style?: any;
  children?: React.ReactNode;
}

export const BaseComponent: React.FC<BaseComponentProps> = ({
  gestures = ['tap'],
  animationHooks = ['onPressScaleSpring'],
  useSkia = true,
  style,
  children,
  accessibilityLabel,
  accessibilityRole,
  ...props
}) => {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  // Setup gestures
  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      if (animationHooks.includes('onPressScaleSpring')) {
        scale.value = withSpring(0.96, MOTION_CONFIGS.spring);
      }
    })
    .onFinalize(() => {
      scale.value = withSpring(1, MOTION_CONFIGS.spring);
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      if (animationHooks.includes('onFocusTransition')) {
        opacity.value = withTiming(0.75, {duration: 150});
      }
    })
    .onEnd(() => {
      opacity.value = withTiming(1, {duration: 150});
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (animationHooks.includes('onDismissSwipe')) {
        translateY.value = event.translationY;
        opacity.value = 1 - Math.abs(event.translationY) / 200;
      }
    })
    .onEnd(() => {
      translateY.value = withSpring(0, MOTION_CONFIGS.spring);
      opacity.value = withSpring(1, MOTION_CONFIGS.spring);
    });

  // Compose gestures based on prop
  let composedGesture = tapGesture;
  if (gestures.includes('longPress') || gestures.includes('pressAndHold')) {
    composedGesture = Gesture.Exclusive(longPressGesture, tapGesture);
  }
  if (gestures.includes('pan') || gestures.includes('drag')) {
    composedGesture = Gesture.Race(panGesture, composedGesture);
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {translateY: translateY.value},
    ],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[styles.container, animatedStyle, style]}
        accessible
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
      >
        {useSkia ? (
          <Canvas style={styles.canvas}>
            <RoundedRect
              x={0}
              y={0}
              width={200}
              height={100}
              r={12}
              color="#007AFF"
            >
              <Shadow dx={0} dy={4} blur={8} color="rgba(0,0,0,0.15)" />
            </RoundedRect>
          </Canvas>
        ) : null}
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  canvas: {
    flex: 1,
  },
});
