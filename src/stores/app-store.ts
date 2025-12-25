import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  UserType, ScreenType, Vendor, Job, RequestDetails, Conversation, 
  AvailableJob, Offer, UserProfile, Rewards, Notification, VendorStats 
} from '@/types/stack';
import { 
  initialUserProfile, initialRewards, initialJobs, initialVendors, 
  initialConversations, initialNotifications, initialAvailableJobs, initialVendorStats 
} from '@/data/stack-data';

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  userType: UserType;
  
  // Data state
  userProfile: UserProfile;
  rewards: Rewards;
  jobs: Job[];
  previousVendors: Vendor[];
  notifications: Notification[];
  availableJobs: AvailableJob[];
  vendorStats: VendorStats;
  conversations: Conversation[];
  
  // Selection state
  selectedVendor: Vendor | null;
  selectedJob: Job | null;
  selectedAvailableJob: AvailableJob | null;
  selectedCategory: string | null;
  selectedSubService: string | null;
  selectedConversation: Conversation | null;
  searchQuery: string;
  
  // Form state
  requestDetails: RequestDetails;
  
  // Navigation state
  navigationHistory: ScreenType[];
  navigationDirection: 'forward' | 'back';
}

interface AppActions {
  // Auth actions
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUserType: (userType: UserType) => void;
  login: () => void;
  logout: () => void;
  
  // Selection actions
  setSelectedVendor: (vendor: Vendor | null) => void;
  setSelectedJob: (job: Job | null) => void;
  setSelectedAvailableJob: (job: AvailableJob | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedSubService: (subService: string | null) => void;
  setSelectedConversation: (conversation: Conversation | null) => void;
  setSearchQuery: (query: string) => void;
  
  // Form actions
  setRequestDetails: (details: RequestDetails | ((prev: RequestDetails) => RequestDetails)) => void;
  resetRequestForm: () => void;
  
  // Data actions
  addConversation: (conversation: Conversation) => void;
  updateConversations: (conversations: Conversation[]) => void;
  addJob: (job: Job) => void;
  updateJob: (jobId: number, updates: Partial<Job>) => void;
  
  // Navigation actions
  pushHistory: (screen: ScreenType) => void;
  popHistory: () => ScreenType | undefined;
  clearHistory: () => void;
  setNavigationDirection: (direction: 'forward' | 'back') => void;
}

const initialRequestDetails: RequestDetails = {
  title: '', 
  description: '', 
  category: '', 
  budget: '', 
  urgency: 'flexible', 
  photos: [], 
  bookingType: 'one-time'
};

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      userType: null,
      userProfile: initialUserProfile,
      rewards: initialRewards,
      jobs: initialJobs,
      previousVendors: initialVendors,
      notifications: initialNotifications,
      availableJobs: initialAvailableJobs,
      vendorStats: initialVendorStats,
      conversations: initialConversations,
      selectedVendor: null,
      selectedJob: null,
      selectedAvailableJob: null,
      selectedCategory: null,
      selectedSubService: null,
      selectedConversation: null,
      searchQuery: '',
      requestDetails: initialRequestDetails,
      navigationHistory: [],
      navigationDirection: 'forward',
      
      // Auth actions
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setUserType: (userType) => set({ userType }),
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ 
        isAuthenticated: false, 
        userType: null, 
        navigationHistory: [],
        selectedVendor: null,
        selectedJob: null,
        selectedConversation: null,
      }),
      
      // Selection actions
      setSelectedVendor: (vendor) => set({ selectedVendor: vendor }),
      setSelectedJob: (job) => set({ selectedJob: job }),
      setSelectedAvailableJob: (job) => set({ selectedAvailableJob: job }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedSubService: (subService) => set({ selectedSubService: subService }),
      setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // Form actions
      setRequestDetails: (details) => set((state) => ({
        requestDetails: typeof details === 'function' ? details(state.requestDetails) : details
      })),
      resetRequestForm: () => {
        const { selectedSubService, selectedCategory } = get();
        set({
          requestDetails: {
            ...initialRequestDetails,
            title: selectedSubService || selectedCategory || '',
            category: selectedCategory || '',
            subService: selectedSubService || '',
          }
        });
      },
      
      // Data actions
      addConversation: (conversation) => set((state) => ({
        conversations: [conversation, ...state.conversations]
      })),
      updateConversations: (conversations) => set({ conversations }),
      addJob: (job) => set((state) => ({
        jobs: [...state.jobs, job]
      })),
      updateJob: (jobId, updates) => set((state) => ({
        jobs: state.jobs.map(job => job.id === jobId ? { ...job, ...updates } : job)
      })),
      
      // Navigation actions
      pushHistory: (screen) => set((state) => ({
        navigationHistory: [...state.navigationHistory, screen],
        navigationDirection: 'forward'
      })),
      popHistory: () => {
        const { navigationHistory } = get();
        if (navigationHistory.length === 0) return undefined;
        const newHistory = [...navigationHistory];
        const lastScreen = newHistory.pop();
        set({ navigationHistory: newHistory, navigationDirection: 'back' });
        return lastScreen;
      },
      clearHistory: () => set({ navigationHistory: [] }),
      setNavigationDirection: (direction) => set({ navigationDirection: direction }),
    }),
    { name: 'app-store' }
  )
);

// Selectors for optimized re-renders
export const useAuth = () => useAppStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  userType: state.userType,
}));

export const useSelections = () => useAppStore((state) => ({
  selectedVendor: state.selectedVendor,
  selectedJob: state.selectedJob,
  selectedAvailableJob: state.selectedAvailableJob,
  selectedCategory: state.selectedCategory,
  selectedSubService: state.selectedSubService,
  selectedConversation: state.selectedConversation,
}));

export const useNavigation = () => useAppStore((state) => ({
  navigationHistory: state.navigationHistory,
  navigationDirection: state.navigationDirection,
}));
