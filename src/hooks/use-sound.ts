import { useCallback, useRef } from 'react';

// Sound effect types
type SoundType = 'tap' | 'success' | 'error' | 'notification' | 'swoosh';

// Using Web Audio API for lightweight sound synthesis
const createAudioContext = () => {
  if (typeof window !== 'undefined') {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return null;
};

const playTone = (
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.1
) => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};

const soundConfigs: Record<SoundType, (ctx: AudioContext) => void> = {
  tap: (ctx) => {
    playTone(ctx, 800, 0.05, 'sine', 0.08);
  },
  success: (ctx) => {
    playTone(ctx, 523, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(ctx, 659, 0.1, 'sine', 0.1), 100);
    setTimeout(() => playTone(ctx, 784, 0.15, 'sine', 0.1), 200);
  },
  error: (ctx) => {
    playTone(ctx, 200, 0.15, 'square', 0.08);
    setTimeout(() => playTone(ctx, 150, 0.2, 'square', 0.08), 150);
  },
  notification: (ctx) => {
    playTone(ctx, 880, 0.1, 'sine', 0.1);
    setTimeout(() => playTone(ctx, 1100, 0.15, 'sine', 0.08), 120);
  },
  swoosh: (ctx) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  },
};

export const useSound = (enabled: boolean = true) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const play = useCallback((type: SoundType = 'tap') => {
    if (!enabled) return;

    try {
      // Create or resume audio context (needs user interaction first)
      if (!audioContextRef.current) {
        audioContextRef.current = createAudioContext();
      }

      const ctx = audioContextRef.current;
      if (!ctx) return;

      // Resume context if suspended (browsers require user gesture)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      soundConfigs[type](ctx);
    } catch (e) {
      // Silently fail if audio is not supported
    }
  }, [enabled]);

  return { play };
};

// Standalone function for use outside of React components
let globalAudioContext: AudioContext | null = null;

export const playSound = (type: SoundType = 'tap') => {
  try {
    if (!globalAudioContext) {
      globalAudioContext = createAudioContext();
    }

    const ctx = globalAudioContext;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    soundConfigs[type](ctx);
  } catch (e) {
    // Silently fail
  }
};
