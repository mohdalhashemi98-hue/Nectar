import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/stores/app-store';

/**
 * Data prefetching hook for TanStack Query
 * 
 * Prefetches actual data for likely next screens based on current route,
 * not just JS chunks. This reduces perceived loading time.
 */
export const useDataPrefetch = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { userType } = useAppStore();

  // Prefetch vendors data
  const prefetchVendors = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['vendors'],
      queryFn: async () => {
        const { data } = await supabase.from('vendors').select('*').limit(20);
        return data || [];
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  }, [queryClient]);

  // Prefetch jobs data
  const prefetchJobs = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    queryClient.prefetchQuery({
      queryKey: ['jobs'],
      queryFn: async () => {
        const { data } = await supabase
          .from('jobs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        return data || [];
      },
      staleTime: 1000 * 60 * 5,
    });
  }, [queryClient]);

  // Prefetch conversations data
  const prefetchConversations = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    queryClient.prefetchQuery({
      queryKey: ['conversations'],
      queryFn: async () => {
        const { data } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('last_message_time', { ascending: false });
        return data || [];
      },
      staleTime: 1000 * 60 * 2, // 2 minutes for fresher chat data
    });
  }, [queryClient]);

  // Prefetch notifications data
  const prefetchNotifications = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    queryClient.prefetchQuery({
      queryKey: ['notifications'],
      queryFn: async () => {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        return data || [];
      },
      staleTime: 1000 * 60 * 2,
    });
  }, [queryClient]);

  // Prefetch available jobs (for vendors)
  const prefetchAvailableJobs = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['availableJobs'],
      queryFn: async () => {
        const { data } = await supabase
          .from('available_jobs')
          .select('*')
          .order('created_at', { ascending: false });
        return data || [];
      },
      staleTime: 1000 * 60 * 5,
    });
  }, [queryClient]);

  // Prefetch rewards data
  const prefetchRewards = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    queryClient.prefetchQuery({
      queryKey: ['rewards'],
      queryFn: async () => {
        const { data } = await supabase
          .from('rewards')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        return data;
      },
      staleTime: 1000 * 60 * 5,
    });
  }, [queryClient]);

  // Prefetch favorite vendor IDs
  const prefetchFavorites = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    queryClient.prefetchQuery({
      queryKey: ['favoriteVendorIds'],
      queryFn: async () => {
        const { data } = await supabase
          .from('user_favorites')
          .select('vendor_id')
          .eq('user_id', user.id);
        return new Set(data?.map(fav => fav.vendor_id) || []);
      },
      staleTime: 1000 * 60 * 5,
    });
  }, [queryClient]);

  // Determine what to prefetch based on current route
  useEffect(() => {
    const path = location.pathname;
    
    // Delay prefetch slightly to prioritize current page render
    const timer = setTimeout(() => {
      // From consumer home - prefetch jobs, vendors, rewards, messages
      if (path === '/consumer') {
        prefetchJobs();
        prefetchVendors();
        prefetchRewards();
        prefetchConversations();
        prefetchFavorites();
      }
      
      // From vendor home - prefetch available jobs, messages, stats
      if (path === '/vendor') {
        prefetchAvailableJobs();
        prefetchConversations();
        prefetchNotifications();
      }
      
      // From jobs list - prefetch vendors for potential navigation
      if (path === '/jobs') {
        prefetchVendors();
      }
      
      // From messages - prefetch notifications
      if (path === '/messages') {
        prefetchNotifications();
      }
      
      // From login/welcome - prefetch vendors (public data)
      if (path === '/' || path === '/login') {
        prefetchVendors();
      }
      
      // From rewards - prefetch jobs for transaction history
      if (path === '/rewards') {
        prefetchJobs();
      }
      
    }, 100); // Small delay to let current page render first

    return () => clearTimeout(timer);
  }, [
    location.pathname, 
    userType,
    prefetchJobs, 
    prefetchVendors, 
    prefetchRewards, 
    prefetchConversations,
    prefetchNotifications,
    prefetchAvailableJobs,
    prefetchFavorites
  ]);

  return {
    prefetchVendors,
    prefetchJobs,
    prefetchConversations,
    prefetchNotifications,
    prefetchAvailableJobs,
    prefetchRewards,
    prefetchFavorites,
  };
};

export default useDataPrefetch;
