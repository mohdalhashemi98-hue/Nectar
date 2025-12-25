import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Certification {
  id: string;
  title: string;
  issuingBody: string;
  imageUrl: string | null;
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  caption: string;
}

export interface VendorOnboardingData {
  // Step 1: Core Identity
  businessName: string;
  yearsExperience: number;
  bio: string;
  serviceCategory: string;
  
  // Step 2: Skills & Tags
  skills: string[];
  
  // Step 3: Certifications
  certifications: Certification[];
  
  // Step 4: Portfolio
  portfolio: PortfolioItem[];
}

interface VendorOnboardingState {
  currentStep: number;
  data: VendorOnboardingData;
  isComplete: boolean;
}

interface VendorOnboardingActions {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (updates: Partial<VendorOnboardingData>) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, updates: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  addPortfolioItem: (item: PortfolioItem) => void;
  updatePortfolioItem: (id: string, updates: Partial<PortfolioItem>) => void;
  removePortfolioItem: (id: string) => void;
  setComplete: (complete: boolean) => void;
  resetOnboarding: () => void;
}

const initialData: VendorOnboardingData = {
  businessName: '',
  yearsExperience: 0,
  bio: '',
  serviceCategory: '',
  skills: [],
  certifications: [],
  portfolio: [],
};

export const useVendorOnboardingStore = create<VendorOnboardingState & VendorOnboardingActions>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      data: initialData,
      isComplete: false,
      
      setStep: (step) => set({ currentStep: Math.max(1, Math.min(4, step)) }),
      
      nextStep: () => set((state) => ({ 
        currentStep: Math.min(4, state.currentStep + 1) 
      })),
      
      prevStep: () => set((state) => ({ 
        currentStep: Math.max(1, state.currentStep - 1) 
      })),
      
      updateData: (updates) => set((state) => ({
        data: { ...state.data, ...updates }
      })),
      
      addSkill: (skill) => set((state) => ({
        data: {
          ...state.data,
          skills: state.data.skills.includes(skill) 
            ? state.data.skills 
            : [...state.data.skills, skill]
        }
      })),
      
      removeSkill: (skill) => set((state) => ({
        data: {
          ...state.data,
          skills: state.data.skills.filter(s => s !== skill)
        }
      })),
      
      addCertification: (cert) => set((state) => ({
        data: {
          ...state.data,
          certifications: [...state.data.certifications, cert]
        }
      })),
      
      updateCertification: (id, updates) => set((state) => ({
        data: {
          ...state.data,
          certifications: state.data.certifications.map(c => 
            c.id === id ? { ...c, ...updates } : c
          )
        }
      })),
      
      removeCertification: (id) => set((state) => ({
        data: {
          ...state.data,
          certifications: state.data.certifications.filter(c => c.id !== id)
        }
      })),
      
      addPortfolioItem: (item) => set((state) => ({
        data: {
          ...state.data,
          portfolio: [...state.data.portfolio, item]
        }
      })),
      
      updatePortfolioItem: (id, updates) => set((state) => ({
        data: {
          ...state.data,
          portfolio: state.data.portfolio.map(p => 
            p.id === id ? { ...p, ...updates } : p
          )
        }
      })),
      
      removePortfolioItem: (id) => set((state) => ({
        data: {
          ...state.data,
          portfolio: state.data.portfolio.filter(p => p.id !== id)
        }
      })),
      
      setComplete: (complete) => set({ isComplete: complete }),
      
      resetOnboarding: () => set({
        currentStep: 1,
        data: initialData,
        isComplete: false,
      }),
    }),
    {
      name: 'vendor-onboarding-storage',
    }
  )
);
