import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Job, Vendor, Conversation, Notification, AvailableJob, 
  UserProfile, Rewards, VendorStats 
} from '@/types/stack';
import { 
  initialUserProfile, initialRewards, initialJobs, initialVendors, 
  initialConversations, initialNotifications, initialAvailableJobs, initialVendorStats 
} from '@/data/stack-data';

// Simulate async data fetching with artificial delay
const simulateDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// API simulation functions
const fetchUserProfile = async (): Promise<UserProfile> => {
  await simulateDelay(200);
  return initialUserProfile;
};

const fetchRewards = async (): Promise<Rewards> => {
  await simulateDelay(250);
  return initialRewards;
};

const fetchJobs = async (): Promise<Job[]> => {
  await simulateDelay(300);
  return initialJobs;
};

const fetchVendors = async (): Promise<Vendor[]> => {
  await simulateDelay(350);
  return initialVendors;
};

const fetchConversations = async (): Promise<Conversation[]> => {
  await simulateDelay(200);
  return initialConversations;
};

const fetchNotifications = async (): Promise<Notification[]> => {
  await simulateDelay(150);
  return initialNotifications;
};

const fetchAvailableJobs = async (): Promise<AvailableJob[]> => {
  await simulateDelay(300);
  return initialAvailableJobs;
};

const fetchVendorStats = async (): Promise<VendorStats> => {
  await simulateDelay(200);
  return initialVendorStats;
};

const fetchVendorById = async (id: number): Promise<Vendor | null> => {
  await simulateDelay(200);
  return initialVendors.find(v => v.id === id) || null;
};

// Query hooks
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });
};

export const useRewards = () => {
  return useQuery({
    queryKey: ['rewards'],
    queryFn: fetchRewards,
  });
};

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });
};

export const useVendors = () => {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: fetchVendors,
  });
};

export const useVendorById = (id: number | null) => {
  return useQuery({
    queryKey: ['vendor', id],
    queryFn: () => fetchVendorById(id!),
    enabled: id !== null,
  });
};

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  });
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });
};

export const useAvailableJobs = () => {
  return useQuery({
    queryKey: ['availableJobs'],
    queryFn: fetchAvailableJobs,
  });
};

export const useVendorStats = () => {
  return useQuery({
    queryKey: ['vendorStats'],
    queryFn: fetchVendorStats,
  });
};

// Mutation hooks with optimistic updates
export const useAddJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newJob: Omit<Job, 'id'>) => {
      await simulateDelay(500);
      const job: Job = { ...newJob, id: Date.now() };
      return job;
    },
    onMutate: async (newJob) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['jobs'] });
      
      // Snapshot previous value
      const previousJobs = queryClient.getQueryData<Job[]>(['jobs']);
      
      // Optimistically update
      const optimisticJob: Job = { ...newJob, id: Date.now() };
      queryClient.setQueryData<Job[]>(['jobs'], (old) => 
        old ? [...old, optimisticJob] : [optimisticJob]
      );
      
      return { previousJobs };
    },
    onError: (err, newJob, context) => {
      // Rollback on error
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs'], context.previousJobs);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ conversationId, message }: { conversationId: number; message: string }) => {
      await simulateDelay(300);
      return { conversationId, message, id: Date.now(), time: 'Just now' };
    },
    onMutate: async ({ conversationId, message }) => {
      await queryClient.cancelQueries({ queryKey: ['conversations'] });
      
      const previousConversations = queryClient.getQueryData<Conversation[]>(['conversations']);
      
      // Optimistically add message
      queryClient.setQueryData<Conversation[]>(['conversations'], (old) => 
        old?.map(conv => 
          conv.id === conversationId 
            ? {
                ...conv,
                lastMessage: message,
                time: 'Just now',
                messages: [...conv.messages, {
                  id: Date.now(),
                  sender: 'user' as const,
                  text: message,
                  time: 'Just now'
                }]
              }
            : conv
        ) || []
      );
      
      return { previousConversations };
    },
    onError: (err, variables, context) => {
      if (context?.previousConversations) {
        queryClient.setQueryData(['conversations'], context.previousConversations);
      }
    },
  });
};
