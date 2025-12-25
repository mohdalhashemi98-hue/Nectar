// Haptic feedback utility using Web Vibration API
// Works on Android and some iOS browsers (Safari has limited support)

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const vibrationPatterns: Record<HapticStyle, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 10],
  warning: [30, 50, 30],
  error: [50, 30, 50, 30, 50],
};

export const haptic = (style: HapticStyle = 'light') => {
  // Check if vibration API is supported
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(vibrationPatterns[style]);
    } catch (e) {
      // Silently fail if vibration is not supported
    }
  }
};

export const useHaptic = () => {
  const trigger = (style: HapticStyle = 'light') => {
    haptic(style);
  };

  return { trigger };
};
