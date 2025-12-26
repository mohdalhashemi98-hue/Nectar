import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  hapticEnabled: boolean;
  soundEnabled: boolean;
}

interface SettingsActions {
  setHapticEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleHaptic: () => void;
  toggleSound: () => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      hapticEnabled: true,
      soundEnabled: true,
      
      setHapticEnabled: (enabled) => set({ hapticEnabled: enabled }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      toggleHaptic: () => set((state) => ({ hapticEnabled: !state.hapticEnabled })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    { name: 'settings-storage' }
  )
);
