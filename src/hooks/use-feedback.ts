import { useCallback } from 'react';
import { haptic } from './use-haptic';
import { playSound } from './use-sound';

type FeedbackType = 'tap' | 'success' | 'error' | 'warning';

interface FeedbackOptions {
  hapticEnabled?: boolean;
  soundEnabled?: boolean;
}

// Combined hook for both haptic and sound feedback
export const useFeedback = (options: FeedbackOptions = {}) => {
  const { hapticEnabled = true, soundEnabled = true } = options;

  const trigger = useCallback((type: FeedbackType = 'tap') => {
    if (hapticEnabled) {
      switch (type) {
        case 'tap':
          haptic('light');
          break;
        case 'success':
          haptic('success');
          break;
        case 'error':
          haptic('error');
          break;
        case 'warning':
          haptic('warning');
          break;
      }
    }

    if (soundEnabled) {
      switch (type) {
        case 'tap':
          playSound('tap');
          break;
        case 'success':
          playSound('success');
          break;
        case 'error':
          playSound('error');
          break;
        case 'warning':
          playSound('notification');
          break;
      }
    }
  }, [hapticEnabled, soundEnabled]);

  return { trigger };
};

// Standalone function for simple usage
export const triggerFeedback = (type: FeedbackType = 'tap') => {
  haptic(type === 'tap' ? 'light' : type);
  playSound(type === 'warning' ? 'notification' : type);
};
