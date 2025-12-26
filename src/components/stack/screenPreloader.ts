import { lazy, ComponentType } from 'react';

// Screen component factories for lazy loading
const screenImports = {
  LoginScreen: () => import('./screens/LoginScreen'),
  WelcomeScreen: () => import('./screens/WelcomeScreen'),
  ConsumerHomeScreen: () => import('./screens/ConsumerHomeScreen'),
  VendorHomeScreen: () => import('./screens/VendorHomeScreen'),
  VendorProfileScreen: () => import('./screens/VendorProfileScreen'),
  VendorScheduleScreen: () => import('./screens/VendorScheduleScreen'),
  RewardsScreen: () => import('./screens/RewardsScreen'),
  ProfileScreen: () => import('./screens/ProfileScreen'),
  JobsScreen: () => import('./screens/JobsScreen'),
  JobDetailScreen: () => import('./screens/JobDetailScreen'),
  MessagesScreen: () => import('./screens/MessagesScreen'),
  ChatScreen: () => import('./screens/ChatScreen'),
  CompanyProfileScreen: () => import('./screens/CompanyProfileScreen'),
  PostJobScreen: () => import('./screens/PostJobScreen'),
  JobConfigurationScreen: () => import('./screens/JobConfigurationScreen'),
  ReviewScreen: () => import('./screens/ReviewScreen'),
  NotificationsScreen: () => import('./screens/NotificationsScreen'),
  RequestDetailScreen: () => import('./screens/RequestDetailScreen'),
  VendorWorkScreen: () => import('./screens/VendorWorkScreen'),
  PaymentScreen: () => import('./screens/PaymentScreen'),
  TransactionsScreen: () => import('./screens/TransactionsScreen'),
  QuoteManagementScreen: () => import('./screens/QuoteManagementScreen'),
  MarketBenchmarkScreen: () => import('./screens/MarketBenchmarkScreen'),
  HelpScreen: () => import('./screens/HelpScreen'),
  ServicesScreen: () => import('./screens/ServicesScreen'),
} as const;

export type ScreenName = keyof typeof screenImports;

// Cache for preloaded modules
const preloadedModules = new Map<ScreenName, Promise<any>>();

/**
 * Preload a screen component in the background
 */
export const preloadScreen = (screenName: ScreenName): Promise<any> => {
  if (preloadedModules.has(screenName)) {
    return preloadedModules.get(screenName)!;
  }
  
  const promise = screenImports[screenName]();
  preloadedModules.set(screenName, promise);
  return promise;
};

/**
 * Preload multiple screens at once
 */
export const preloadScreens = (screenNames: ScreenName[]): void => {
  screenNames.forEach(preloadScreen);
};

/**
 * Get preload targets based on current screen and user type
 * Returns screens that are likely to be navigated to next
 */
export const getPreloadTargets = (
  currentScreen: string, 
  userType: 'consumer' | 'vendor' | null
): ScreenName[] => {
  const targets: ScreenName[] = [];

  // Always preload core navigation screens
  switch (currentScreen) {
    case 'welcome':
      targets.push('LoginScreen', 'ConsumerHomeScreen', 'VendorHomeScreen');
      break;
      
    case 'login':
      if (userType === 'consumer') {
        targets.push('ConsumerHomeScreen');
      } else if (userType === 'vendor') {
        targets.push('VendorHomeScreen');
      }
      break;
      
    case 'consumer-home':
      targets.push(
        'ServicesScreen', 
        'ProfileScreen', 
        'MessagesScreen', 
        'NotificationsScreen',
        'RewardsScreen',
        'VendorProfileScreen'
      );
      break;
      
    case 'vendor-home':
      targets.push(
        'ProfileScreen', 
        'MessagesScreen', 
        'NotificationsScreen',
        'VendorWorkScreen',
        'RequestDetailScreen',
        'MarketBenchmarkScreen'
      );
      break;
      
    case 'services':
      targets.push('JobConfigurationScreen', 'ConsumerHomeScreen');
      break;
      
    case 'job-configuration':
      targets.push('PostJobScreen', 'ServicesScreen');
      break;
      
    case 'messages-list':
      targets.push('ChatScreen');
      break;
      
    case 'job-detail':
      targets.push('ChatScreen', 'PaymentScreen', 'ReviewScreen', 'QuoteManagementScreen');
      break;
      
    case 'profile':
      targets.push('NotificationsScreen', 'HelpScreen', 'TransactionsScreen');
      break;
      
    case 'rewards':
      targets.push('ProfileScreen', 'ConsumerHomeScreen');
      break;
      
    case 'transactions':
      targets.push('JobDetailScreen', 'ProfileScreen');
      break;
  }

  return targets;
};

// Lazy loaded screen components
export const LazyScreens = {
  LoginScreen: lazy(screenImports.LoginScreen),
  WelcomeScreen: lazy(screenImports.WelcomeScreen),
  ConsumerHomeScreen: lazy(screenImports.ConsumerHomeScreen),
  VendorHomeScreen: lazy(screenImports.VendorHomeScreen),
  VendorProfileScreen: lazy(screenImports.VendorProfileScreen),
  VendorScheduleScreen: lazy(screenImports.VendorScheduleScreen),
  RewardsScreen: lazy(screenImports.RewardsScreen),
  ProfileScreen: lazy(screenImports.ProfileScreen),
  JobsScreen: lazy(screenImports.JobsScreen),
  JobDetailScreen: lazy(screenImports.JobDetailScreen),
  MessagesScreen: lazy(screenImports.MessagesScreen),
  ChatScreen: lazy(screenImports.ChatScreen),
  CompanyProfileScreen: lazy(screenImports.CompanyProfileScreen),
  PostJobScreen: lazy(screenImports.PostJobScreen),
  JobConfigurationScreen: lazy(screenImports.JobConfigurationScreen),
  ReviewScreen: lazy(screenImports.ReviewScreen),
  NotificationsScreen: lazy(screenImports.NotificationsScreen),
  RequestDetailScreen: lazy(screenImports.RequestDetailScreen),
  VendorWorkScreen: lazy(screenImports.VendorWorkScreen),
  PaymentScreen: lazy(screenImports.PaymentScreen),
  TransactionsScreen: lazy(screenImports.TransactionsScreen),
  QuoteManagementScreen: lazy(screenImports.QuoteManagementScreen),
  MarketBenchmarkScreen: lazy(screenImports.MarketBenchmarkScreen),
  HelpScreen: lazy(screenImports.HelpScreen),
  ServicesScreen: lazy(screenImports.ServicesScreen),
};

// Preload critical screens on app init
export const preloadCriticalScreens = (): void => {
  // Preload welcome and login immediately
  preloadScreens(['WelcomeScreen', 'LoginScreen']);
  
  // Preload home screens after a short delay
  requestIdleCallback(() => {
    preloadScreens(['ConsumerHomeScreen', 'VendorHomeScreen']);
  }, { timeout: 200 });
  
  // Preload common screens when browser is idle
  requestIdleCallback(() => {
    preloadScreens([
      'ProfileScreen',
      'MessagesScreen',
      'NotificationsScreen',
      'ServicesScreen',
    ]);
  }, { timeout: 1000 });
};

// Helper for requestIdleCallback with fallback
const requestIdleCallback = (
  callback: () => void, 
  options?: { timeout: number }
): void => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, options);
  } else {
    setTimeout(callback, options?.timeout || 100);
  }
};
