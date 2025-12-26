// Haptic feedback utility using Web Vibration API
// Works on Android and some iOS browsers (Safari has limited support)

import { useSettingsStore } from '@/stores/settings-store';

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const vibrationPatterns: Record<HapticStyle, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 10],
  warning: [30, 50, 30],
  error: [50, 30, 50, 30, 50],
};

// Get haptic enabled state from store (for use outside React components)
const getHapticEnabled = () => {
  try {
    const stored = localStorage.getItem('settings-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.hapticEnabled ?? true;
    }
  } catch {
    // Fall back to enabled if parsing fails
  }
  return true;
};

export const haptic = (style: HapticStyle = 'light') => {
  // Check if haptic is enabled
  if (!getHapticEnabled()) return;
  
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
  const hapticEnabled = useSettingsStore((state) => state.hapticEnabled);
  
  const trigger = (style: HapticStyle = 'light') => {
    if (!hapticEnabled) return;
    
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(vibrationPatterns[style]);
      } catch (e) {
        // Silently fail if vibration is not supported
      }
    }
  };

  return { trigger, hapticEnabled };
};
