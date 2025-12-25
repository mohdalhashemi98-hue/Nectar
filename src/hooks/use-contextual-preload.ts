import { useCallback, useRef } from 'react';
import { preloadScreens, ScreenName } from '@/components/stack/screenPreloader';
import { ScreenType } from '@/types/stack';

// Map ScreenType to ScreenName for preloading
const screenTypeToName: Partial<Record<ScreenType, ScreenName>> = {
  'welcome': 'WelcomeScreen',
  'login': 'LoginScreen',
  'consumer-home': 'ConsumerHomeScreen',
  'vendor-home': 'VendorHomeScreen',
  'vendor-profile': 'VendorProfileScreen',
  'vendor-schedule': 'VendorScheduleScreen',
  'rewards': 'RewardsScreen',
  'profile': 'ProfileScreen',
  'job-detail': 'JobDetailScreen',
  'transactions': 'TransactionsScreen',
  'messages-list': 'MessagesScreen',
  'chat': 'ChatScreen',
  'post-request': 'PostJobScreen',
  'job-configuration': 'JobConfigurationScreen',
  'review': 'ReviewScreen',
  'notifications': 'NotificationsScreen',
  'request-detail': 'RequestDetailScreen',
  'payment': 'PaymentScreen',
  'quote-management': 'QuoteManagementScreen',
  'market-benchmark': 'MarketBenchmarkScreen',
  'company-profile': 'CompanyProfileScreen',
  'help': 'HelpScreen',
  'services': 'ServicesScreen',
};

// Map of screen types to preload targets (as ScreenName)
const preloadMap: Partial<Record<ScreenType, ScreenName[]>> = {
  'welcome': ['LoginScreen', 'ConsumerHomeScreen', 'VendorHomeScreen'],
  'login': ['ConsumerHomeScreen', 'VendorHomeScreen'],
  'consumer-home': ['ServicesScreen', 'RewardsScreen', 'ProfileScreen', 'MessagesScreen', 'PostJobScreen'],
  'vendor-home': ['RequestDetailScreen', 'ProfileScreen', 'MessagesScreen', 'VendorScheduleScreen'],
  'services': ['JobConfigurationScreen', 'PostJobScreen'],
  'profile': ['RewardsScreen', 'HelpScreen', 'CompanyProfileScreen'],
  'messages-list': ['ChatScreen'],
  'vendor-profile': ['ChatScreen'],
  'job-detail': ['ReviewScreen', 'PaymentScreen', 'ChatScreen'],
  'quote-management': ['VendorProfileScreen', 'ChatScreen', 'PaymentScreen'],
  'request-detail': ['ChatScreen'],
  'market-benchmark': ['ServicesScreen', 'JobConfigurationScreen'],
};

export const useContextualPreload = () => {
  const preloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const preloadedScreensRef = useRef<Set<ScreenType>>(new Set());

  const preloadOnHover = useCallback((screen: ScreenType) => {
    // Clear any existing timeout
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
    }

    // Debounce the preload to avoid unnecessary work on quick mouse movements
    preloadTimeoutRef.current = setTimeout(() => {
      // Don't preload if already preloaded
      if (preloadedScreensRef.current.has(screen)) {
        return;
      }

      // Mark as preloaded
      preloadedScreensRef.current.add(screen);

      // Get ScreenName for the screen and its targets
      const screenName = screenTypeToName[screen];
      const targetScreenNames = preloadMap[screen] || [];
      
      const allTargets: ScreenName[] = [];
      if (screenName) allTargets.push(screenName);
      allTargets.push(...targetScreenNames);
      
      if (allTargets.length > 0) {
        preloadScreens(allTargets);
      }
    }, 100); // 100ms debounce
  }, []);

  const preloadOnTouchStart = useCallback((screen: ScreenType) => {
    // Immediately preload on touch (no debounce for touch - user is committed)
    if (!preloadedScreensRef.current.has(screen)) {
      preloadedScreensRef.current.add(screen);
      
      const screenName = screenTypeToName[screen];
      const targetScreenNames = preloadMap[screen] || [];
      
      const allTargets: ScreenName[] = [];
      if (screenName) allTargets.push(screenName);
      allTargets.push(...targetScreenNames);
      
      if (allTargets.length > 0) {
        preloadScreens(allTargets);
      }
    }
  }, []);

  const cancelPreload = useCallback(() => {
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
      preloadTimeoutRef.current = null;
    }
  }, []);

  // Create props to spread on navigation elements
  const getPreloadProps = useCallback((screen: ScreenType) => ({
    onMouseEnter: () => preloadOnHover(screen),
    onMouseLeave: cancelPreload,
    onTouchStart: () => preloadOnTouchStart(screen),
  }), [preloadOnHover, preloadOnTouchStart, cancelPreload]);

  return {
    preloadOnHover,
    preloadOnTouchStart,
    cancelPreload,
    getPreloadProps,
  };
};

export default useContextualPreload;