import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Job, Vendor, Conversation, Notification, AvailableJob, 
  UserProfile, Rewards, VendorStats 
} from '@/types/stack';
import { 
  initialUserProfile, initialRewards, initialJobs, initialVendors, 
  initialConversations, initialNotifications, initialAvailableJobs, initialVendorStats 
} from '@/data/stack-data';

// Helper to check if user is authenticated
const getAuthUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Transform database row to frontend type
const transformProfile = (row: any): UserProfile => ({
  name: row.name || '',
  phone: row.phone || '',
  email: row.email || '',
  avatar: row.avatar || row.name?.charAt(0) || 'U',
  location: row.location || '',
  memberSince: row.member_since || '',
});

const transformRewards = (row: any): Rewards => ({
  points: row.points || 0,
  tier: row.tier || 'Bronze',
  tierProgress: row.tier_progress || 0,
  pointsToNextTier: row.points_to_next_tier || 1000,
  nextTier: row.next_tier || 'Silver',
  cashbackRate: row.cashback_rate || 2,
  streak: row.streak || 0,
  totalSaved: row.total_saved || 0,
  lifetimePoints: row.lifetime_points || 0,
  weeklyChallenge: {
    title: 'Complete 3 Platform Payments',
    progress: 2,
    target: 3,
    reward: 150,
    endsIn: '3 days'
  },
  achievements: [],
  recentEarnings: [],
});

const transformVendor = (row: any, isFavorite: boolean = false): Vendor => ({
  id: row.id, // Keep as UUID string for database operations
  name: row.name || '',
  rating: parseFloat(row.rating) || 5.0,
  reviews: row.reviews || 0,
  avatar: row.avatar || row.name?.charAt(0) || 'V',
  specialty: row.specialty || '',
  verified: row.verified || false,
  favorite: isFavorite || row.favorite || false,
  lastJob: row.last_job || '',
  completedJobs: row.completed_jobs || 0,
  lastJobDate: row.last_job_date || '',
  responseTime: row.response_time || '',
  distance: row.distance || '',
  avgPrice: row.avg_price || '',
  completionRate: row.completion_rate || 100,
  phone: row.phone || '',
});

const transformJob = (row: any): Job => ({
  id: row.id ? parseInt(row.id.substring(0, 8), 16) : 0,
  title: row.title || '',
  vendor: row.vendor_name || null,
  vendorId: row.vendor_id ? parseInt(row.vendor_id.substring(0, 8), 16) : null,
  amount: parseFloat(row.amount) || 0,
  status: row.status || 'Pending',
  paymentStatus: row.payment_status || null,
  pointsEarned: row.points_earned || 0,
  date: row.date || '',
  completedDate: row.completed_date || null,
  rated: row.rated || false,
  rating: row.rating || 0,
  category: row.category || '',
  offersCount: row.offers_count,
});

const transformConversation = (row: any): Conversation => ({
  id: row.id ? parseInt(row.id.substring(0, 8), 16) : 0,
  name: row.name || '',
  avatar: row.avatar || row.name?.charAt(0) || 'U',
  lastMessage: row.last_message || '',
  time: row.last_message_time ? new Date(row.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
  unread: row.unread || false,
  online: row.online || false,
  messages: [],
});

const transformNotification = (row: any): Notification => ({
  id: row.id ? parseInt(row.id.substring(0, 8), 16) : 0,
  icon: row.icon || '',
  title: row.title || '',
  message: row.message || '',
  time: row.time || '',
  unread: row.unread || false,
  type: row.type || '',
});

const transformAvailableJob = (row: any): AvailableJob => ({
  id: row.id ? parseInt(row.id.substring(0, 8), 16) : 0,
  title: row.title || '',
  budget: row.budget || '',
  distance: row.distance || '',
  time: row.time || '',
  urgent: row.urgent || false,
  category: row.category || '',
  description: row.description || '',
  client: {
    name: row.client_name || '',
    member: row.client_member_since || '',
  },
});

const transformVendorStats = (row: any): VendorStats => ({
  totalJobs: row.total_jobs || 0,
  totalEarnings: parseFloat(row.total_earnings) || 0,
  rating: parseFloat(row.rating) || 5.0,
  reviews: row.reviews || 0,
  completionRate: row.completion_rate || 100,
  responseTime: row.response_time || '',
  thisMonth: {
    jobs: row.this_month_jobs || 0,
    earnings: parseFloat(row.this_month_earnings) || 0,
  },
});

// Query hooks - fetch from database, fallback to initial data if not authenticated
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const user = await getAuthUser();
      if (!user) return initialUserProfile;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error || !data) return initialUserProfile;
      return transformProfile(data);
    },
  });
};

export const useRewards = () => {
  return useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const user = await getAuthUser();
      if (!user) return initialRewards;
      
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error || !data) return initialRewards;
      return transformRewards(data);
    },
  });
};

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const user = await getAuthUser();
      if (!user) return initialJobs;
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error || !data || data.length === 0) return initialJobs;
      return data.map(transformJob);
    },
  });
};

export const useVendors = () => {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .limit(20);
      
      if (error || !data || data.length === 0) return initialVendors;
      return data.map(row => transformVendor(row));
    },
  });
};

export const useVendorById = (id: string | null) => {
  return useQuery({
    queryKey: ['vendor', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error || !data) return null;
      return transformVendor(data);
    },
    enabled: !!id,
  });
};

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const user = await getAuthUser();
      if (!user) return initialConversations;
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_time', { ascending: false });
      
      if (error || !data || data.length === 0) return initialConversations;
      return data.map(transformConversation);
    },
  });
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const user = await getAuthUser();
      if (!user) return initialNotifications;
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error || !data || data.length === 0) return initialNotifications;
      return data.map(transformNotification);
    },
  });
};

export const useAvailableJobs = () => {
  return useQuery({
    queryKey: ['availableJobs'],
    queryFn: async () => {
      // Available jobs are public - fetch them regardless of auth status
      const { data, error } = await supabase
        .from('available_jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error || !data || data.length === 0) return initialAvailableJobs;
      return data.map(transformAvailableJob);
    },
  });
};

export const useVendorStats = () => {
  return useQuery({
    queryKey: ['vendorStats'],
    queryFn: async () => {
      const user = await getAuthUser();
      if (!user) return initialVendorStats;
      
      const { data, error } = await supabase
        .from('vendor_stats')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error || !data) return initialVendorStats;
      return transformVendorStats(data);
    },
  });
};

// Mutation hooks with optimistic updates
export const useAddJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newJob: Omit<Job, 'id'>) => {
      const user = await getAuthUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          user_id: user.id,
          title: newJob.title,
          vendor_name: newJob.vendor,
          amount: newJob.amount,
          status: newJob.status,
          payment_status: newJob.paymentStatus,
          category: newJob.category,
          date: newJob.date,
        })
        .select()
        .single();
      
      if (error) throw error;
      return transformJob(data);
    },
    onMutate: async (newJob) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] });
      const previousJobs = queryClient.getQueryData<Job[]>(['jobs']);
      
      const optimisticJob: Job = { ...newJob, id: Date.now() };
      queryClient.setQueryData<Job[]>(['jobs'], (old) => 
        old ? [...old, optimisticJob] : [optimisticJob]
      );
      
      return { previousJobs };
    },
    onError: (err, newJob, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs'], context.previousJobs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ conversationId, message }: { conversationId: number; message: string }) => {
      const user = await getAuthUser();
      if (!user) throw new Error('Not authenticated');
      
      // For demo, just return optimistic result
      return { conversationId, message, id: Date.now(), time: 'Just now' };
    },
    onMutate: async ({ conversationId, message }) => {
      await queryClient.cancelQueries({ queryKey: ['conversations'] });
      
      const previousConversations = queryClient.getQueryData<Conversation[]>(['conversations']);
      
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

// ============= Favorites Queries =============

export const useFavoriteVendors = () => {
  return useQuery({
    queryKey: ['favoriteVendors'],
    queryFn: async () => {
      const user = await getAuthUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          vendor_id,
          vendors (*)
        `)
        .eq('user_id', user.id);
      
      if (error || !data) return [];
      
      return data
        .filter(fav => fav.vendors)
        .map(fav => transformVendor(fav.vendors, true));
    },
  });
};

export const useFavoriteVendorIds = () => {
  return useQuery({
    queryKey: ['favoriteVendorIds'],
    queryFn: async () => {
      const user = await getAuthUser();
      if (!user) return new Set<string>();
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('vendor_id')
        .eq('user_id', user.id);
      
      if (error || !data) return new Set<string>();
      
      return new Set(data.map(fav => fav.vendor_id));
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ vendorId, isFavorite }: { vendorId: string; isFavorite: boolean }) => {
      const user = await getAuthUser();
      if (!user) throw new Error('User not authenticated');
      
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('vendor_id', vendorId);
        
        if (error) throw error;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, vendor_id: vendorId });
        
        if (error) throw error;
      }
      
      return { vendorId, newState: !isFavorite };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteVendors'] });
      queryClient.invalidateQueries({ queryKey: ['favoriteVendorIds'] });
    },
  });
};