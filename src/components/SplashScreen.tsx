import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Canvas, Group, Circle, useValue, runTiming} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

export interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({onFinish}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  // Skia animation values
  const particle1 = useValue(0);
  const particle2 = useValue(0);
  const particle3 = useValue(0);

  useEffect(() => {
    // Fade in and scale animation
    opacity.value = withTiming(1, {duration: 300});
    scale.value = withSpring(1, {stiffness: 100, damping: 15});

    // Particle animations with Skia
    runTiming(particle1, 1, {duration: 1500});
    runTiming(particle2, 1, {duration: 1500});
    runTiming(particle3, 1, {duration: 1500});

    // Complete splash after animation
    const timer = setTimeout(() => {
      opacity.value = withTiming(0, {duration: 300}, () => {
        onFinish();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [opacity, scale, particle1, particle2, particle3, onFinish]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <Canvas style={styles.canvas}>
          {/* Central logo element */}
          <Circle cx={width / 2} cy={height / 2} r={40} color="#007AFF" />

          {/* Animated particles */}
          <Group>
            <Circle
              cx={width / 2 - 60}
              cy={height / 2}
              r={12}
              color="#34C759"
              opacity={0.8}
            />
            <Circle
              cx={width / 2 + 60}
              cy={height / 2}
              r={12}
              color="#FF9500"
              opacity={0.8}
            />
            <Circle
              cx={width / 2}
              cy={height / 2 - 60}
              r={12}
              color="#FF3B30"
              opacity={0.8}
            />
            <Circle
              cx={width / 2}
              cy={height / 2 + 60}
              r={12}
              color="#5856D6"
              opacity={0.8}
            />
          </Group>
        </Canvas>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: width,
    height: height,
  },
});
