import {Vibration, Platform} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export type HapticFeedbackType =
  | 'selection'
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError';

class HapticFeedbackManager {
  private isEnabled = true;

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  trigger(type: HapticFeedbackType) {
    if (!this.isEnabled) return;

    if (Platform.OS === 'ios') {
      // Use native haptic feedback on iOS
      try {
        ReactNativeHapticFeedback.trigger(type, {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
      } catch (error) {
        // Fallback to basic vibration
        this.fallbackVibration(type);
      }
    } else {
      // Fallback for Android or other platforms
      this.fallbackVibration(type);
    }
  }

  private fallbackVibration(type: HapticFeedbackType) {
    const patterns: Record<HapticFeedbackType, number[]> = {
      selection: [10],
      impactLight: [20],
      impactMedium: [30],
      impactHeavy: [50],
      notificationSuccess: [10, 50, 10],
      notificationWarning: [30, 30, 30],
      notificationError: [50, 30, 50],
    };

    const pattern = patterns[type] || [10];
    Vibration.vibrate(pattern);
  }

  // Specific feedback methods
  selection() {
    this.trigger('selection');
  }

  lightImpact() {
    this.trigger('impactLight');
  }

  mediumImpact() {
    this.trigger('impactMedium');
  }

  heavyImpact() {
    this.trigger('impactHeavy');
  }

  success() {
    this.trigger('notificationSuccess');
  }

  warning() {
    this.trigger('notificationWarning');
  }

  error() {
    this.trigger('notificationError');
  }
}

export const hapticFeedback = new HapticFeedbackManager();

// React hook for haptic feedback
export const useHapticFeedback = () => {
  return {
    trigger: (type: HapticFeedbackType) => hapticFeedback.trigger(type),
    selection: () => hapticFeedback.selection(),
    lightImpact: () => hapticFeedback.lightImpact(),
    mediumImpact: () => hapticFeedback.mediumImpact(),
    heavyImpact: () => hapticFeedback.heavyImpact(),
    success: () => hapticFeedback.success(),
    warning: () => hapticFeedback.warning(),
    error: () => hapticFeedback.error(),
  };
};
