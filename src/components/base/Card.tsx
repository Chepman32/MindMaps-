import React from 'react';
import {View, StyleSheet, ViewStyle, Pressable} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {spacing, borderRadius, shadows} from '../../theme/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  variant = 'elevated',
  style,
}) => {
  const scale = useSharedValue(1);
  const elevation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {translateY: -elevation.value},
    ],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, {stiffness: 400, damping: 20});
      elevation.value = withSpring(4, {stiffness: 400, damping: 20});
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, {stiffness: 400, damping: 20});
      elevation.value = withSpring(0, {stiffness: 400, damping: 20});
    }
  };

  const content = <View style={styles.content}>{children}</View>;

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          styles[variant],
          animatedStyle,
          style,
        ]}
        accessible
        accessibilityRole="button"
      >
        {content}
      </AnimatedPressable>
    );
  }

  return (
    <Animated.View
      style={[
        styles.card,
        styles[variant],
        style,
      ]}
    >
      {content}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  elevated: {
    backgroundColor: '#FFFFFF',
    ...shadows.medium,
  },
  outlined: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filled: {
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: spacing.md,
  },
});
