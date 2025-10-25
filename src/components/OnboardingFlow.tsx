import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import {Canvas, Circle, Path} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import {Button} from './base/Button';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

const {width, height} = Dimensions.get('window');

interface OnboardingStep {
  title: string;
  description: string;
  illustration: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: 'Welcome to MindMaps+',
    description:
      'Create beautiful mind maps and organize your thoughts with an intuitive, gesture-first interface.',
    illustration: 'welcome',
  },
  {
    title: 'Gesture-First Design',
    description:
      'Pinch to zoom, pan to move, and tap to create. Everything works exactly as you'd expect.',
    illustration: 'gestures',
  },
  {
    title: 'Fully Offline',
    description:
      'All your data stays on your device. No internet required, complete privacy guaranteed.',
    illustration: 'offline',
  },
  {
    title: 'Export Anywhere',
    description:
      'Share your maps as OPML, PDF, or images. Works with any mind mapping tool.',
    illustration: 'export',
  },
];

interface OnboardingFlowProps {
  visible: boolean;
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  visible,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withSpring(currentStep / (ONBOARDING_STEPS.length - 1), {
      stiffness: 80,
      damping: 15,
    });
  }, [currentStep, progress]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = ONBOARDING_STEPS[currentStep];

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1, {duration: 300}),
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [0, 0]),
      },
    ],
  }));

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.container}>
        {/* Skip Button */}
        {currentStep < ONBOARDING_STEPS.length - 1 && (
          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}

        {/* Illustration */}
        <View style={styles.illustration}>
          <Canvas style={styles.canvas}>
            {/* Simple illustration using Skia */}
            <Circle cx={width / 2} cy={200} r={80} color="#007AFF" opacity={0.2} />
            <Circle cx={width / 2} cy={200} r={60} color="#007AFF" opacity={0.4} />
            <Circle cx={width / 2} cy={200} r={40} color="#007AFF" />
          </Canvas>
        </View>

        {/* Content */}
        <Animated.View style={[styles.content, animatedStyle]}>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>
        </Animated.View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {ONBOARDING_STEPS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <View style={styles.actions}>
          <Button
            title={
              currentStep === ONBOARDING_STEPS.length - 1
                ? 'Get Started'
                : 'Next'
            }
            onPress={handleNext}
            variant="primary"
            size="large"
            style={styles.nextButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.lg,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingTop: 60,
    paddingHorizontal: spacing.md,
  },
  skipText: {
    ...typography.body,
    color: '#007AFF',
  },
  illustration: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    width: width,
    height: 300,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.largeTitle,
    color: '#000000',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5EA',
  },
  progressDotActive: {
    width: 24,
    backgroundColor: '#007AFF',
  },
  actions: {
    paddingBottom: 60,
  },
  nextButton: {
    width: '100%',
  },
});
