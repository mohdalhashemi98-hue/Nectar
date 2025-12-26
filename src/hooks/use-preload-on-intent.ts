import { useCallback } from 'react';
import { preloadScreen, ScreenName } from '@/components/stack/screenPreloader';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Map routes to screen names for preloading
const routeToScreenName: Record<string, ScreenName> = {
  '/consumer': 'ConsumerHomeScreen',
  '/vendor': 'VendorHomeScreen',
  '/profile': 'ProfileScreen',
  '/messages': 'MessagesScreen',
  '/rewards': 'RewardsScreen',
  '/jobs': 'JobsScreen',
  '/notifications': 'NotificationsScreen',
  '/services': 'ServicesScreen',
  '/vendor/schedule': 'VendorScheduleScreen',
  '/vendor/profile-preview': 'VendorProfileScreen',
  '/help': 'HelpScreen',
  '/vendor-work': 'VendorWorkScreen',
};

// Map routes to data prefetch functions
const getDataPrefetcher = (route: string, queryClient: ReturnType<typeof useQueryClient>) => {
  return async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    switch (route) {
      case '/messages':
        if (user) {
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
            staleTime: 1000 * 60 * 2,
          });
        }
        break;
        
      case '/notifications':
        if (user) {
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
        }
        break;
        
      case '/jobs':
        if (user) {
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
        }
        break;
        
      case '/rewards':
        if (user) {
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
        }
        break;
        
      case '/profile':
        if (user) {
          queryClient.prefetchQuery({
            queryKey: ['profile'],
            queryFn: async () => {
              const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();
              return data;
            },
            staleTime: 1000 * 60 * 10,
          });
        }
        break;
    }
  };
};

/**
 * Hook that provides preloading functions for navigation intent
 * Use on hover/touch of navigation elements for instant transitions
 */
export const usePreloadOnIntent = () => {
  const queryClient = useQueryClient();
  
  // Preload screen component and data on intent (hover/touch)
  const preloadOnIntent = useCallback((route: string) => {
    const screenName = routeToScreenName[route];
    
    // Preload the screen component
    if (screenName) {
      preloadScreen(screenName);
    }
    
    // Prefetch the data for this screen
    const prefetchData = getDataPrefetcher(route, queryClient);
    prefetchData();
  }, [queryClient]);
  
  // Create event handlers for navigation elements
  const getPreloadHandlers = useCallback((route: string) => ({
    onMouseEnter: () => preloadOnIntent(route),
    onTouchStart: () => preloadOnIntent(route),
    onFocus: () => preloadOnIntent(route),
  }), [preloadOnIntent]);
  
  return {
    preloadOnIntent,
    getPreloadHandlers,
  };
};

export default usePreloadOnIntent;
