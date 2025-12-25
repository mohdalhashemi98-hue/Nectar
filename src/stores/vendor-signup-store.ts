import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VendorSignupData {
  // Step 1: Hook
  primaryTrade: string;
  
  // Step 2: Account
  name: string;
  email: string;
  phone: string;
  password: string;
  
  // Step 3: Location
  location: string;
  serviceRadius: number;
  coordinates: { lat: number; lng: number } | null;
  
  // Step 4: Verification
  businessLicenseUrl: string | null;
  idPhotoUrl: string | null;
}

interface VendorSignupState {
  currentStep: number;
  data: VendorSignupData;
  isCompleted: boolean;
  userId: string | null;
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateData: (updates: Partial<VendorSignupData>) => void;
  setUserId: (id: string) => void;
  setCompleted: (completed: boolean) => void;
  resetSignup: () => void;
}

const initialData: VendorSignupData = {
  primaryTrade: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  location: '',
  serviceRadius: 15,
  coordinates: null,
  businessLicenseUrl: null,
  idPhotoUrl: null,
};

export const useVendorSignupStore = create<VendorSignupState>()(
  persist(
    (set) => ({
      currentStep: 1,
      data: initialData,
      isCompleted: false,
      userId: null,
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      updateData: (updates) => set((state) => ({
        data: { ...state.data, ...updates }
      })),
      
      setUserId: (id) => set({ userId: id }),
      
      setCompleted: (completed) => set({ isCompleted: completed }),
      
      resetSignup: () => set({
        currentStep: 1,
        data: initialData,
        isCompleted: false,
        userId: null,
      }),
    }),
    {
      name: 'vendor-signup-storage',
    }
  )
);
