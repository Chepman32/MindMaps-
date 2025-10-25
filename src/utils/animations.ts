import {
  withSpring,
  withTiming,
  withDecay,
  Easing,
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {MotionConfig} from '../types';

export const MOTION_CONFIGS = {
  spring: {
    stiffness: 240,
    damping: 18,
    mass: 1,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2,
  },
  timing: {
    duration: 260,
    easing: Easing.out(Easing.cubic),
  },
  fastSpring: {
    stiffness: 320,
    damping: 22,
    mass: 0.8,
  },
  slowSpring: {
    stiffness: 180,
    damping: 14,
    mass: 1.2,
  },
};

export const createPressScaleSpring = (progress: SharedValue<number>) => {
  'worklet';
  return {
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [1, 0.96],
          Extrapolate.CLAMP
        ),
      },
    ],
  };
};

export const createFocusTransition = (progress: SharedValue<number>) => {
  'worklet';
  return {
    opacity: interpolate(
      progress.value,
      [0, 1],
      [0.75, 1],
      Extrapolate.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [0.98, 1],
          Extrapolate.CLAMP
        ),
      },
    ],
  };
};

export const createDismissSwipe = (
  progress: SharedValue<number>,
  direction: 'left' | 'right' = 'right'
) => {
  'worklet';
  const translateX = direction === 'right' ? 300 : -300;
  return {
    opacity: interpolate(
      progress.value,
      [0, 1],
      [1, 0],
      Extrapolate.CLAMP
    ),
    transform: [
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, translateX],
          Extrapolate.CLAMP
        ),
      },
    ],
  };
};

export const createRevealFling = (progress: SharedValue<number>) => {
  'worklet';
  return {
    opacity: interpolate(
      progress.value,
      [0, 0.5, 1],
      [0, 0.5, 1],
      Extrapolate.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [50, 0],
          Extrapolate.CLAMP
        ),
      },
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [0.9, 1],
          Extrapolate.CLAMP
        ),
      },
    ],
  };
};

export const createCardMorphAnimation = (progress: SharedValue<number>) => {
  'worklet';
  return {
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [1, 1.05],
          Extrapolate.CLAMP
        ),
      },
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [0, -8],
          Extrapolate.CLAMP
        ),
      },
    ],
    shadowOpacity: interpolate(
      progress.value,
      [0, 1],
      [0.1, 0.25],
      Extrapolate.CLAMP
    ),
  };
};

export const animateToValue = (
  sharedValue: SharedValue<number>,
  toValue: number,
  config: Partial<MotionConfig> = {}
) => {
  'worklet';
  const {easing = 'spring', duration = 300, stiffness = 240, damping = 18} = config;

  if (easing === 'spring') {
    sharedValue.value = withSpring(toValue, {stiffness, damping});
  } else if (easing === 'timing') {
    sharedValue.value = withTiming(toValue, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  } else if (easing === 'decay') {
    sharedValue.value = withDecay({velocity: toValue});
  }
};

export const useStaggeredAnimation = (count: number, delay: number = 50) => {
  const values = Array.from({length: count}, () => useSharedValue(0));

  const animate = (toValue: number) => {
    values.forEach((value, index) => {
      value.value = withDelay(
        index * delay,
        withSpring(toValue, MOTION_CONFIGS.spring)
      );
    });
  };

  return {values, animate};
};

export const withDelay = (delay: number, animation: any) => {
  'worklet';
  return withTiming(0, {duration: delay}, () => {
    return animation;
  });
};
