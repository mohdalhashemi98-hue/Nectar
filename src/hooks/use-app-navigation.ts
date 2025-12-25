import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/app-store';
import { ScreenType } from '@/types/stack';

// Map screen types to routes
const screenToRoute: Record<ScreenType, string> = {
  'welcome': '/',
  'login': '/login',
  'consumer-home': '/consumer',
  'vendor-home': '/vendor',
  'vendor-schedule': '/vendor/schedule',
  'vendor-profile': '/vendor/profile-preview',
  'profile': '/profile',
  'rewards': '/rewards',
  'notifications': '/notifications',
  'messages-list': '/messages',
  'chat': '/chat',
  'transactions': '/jobs',
  'job-detail': '/job',
  'post-request': '/post-request',
  'job-configuration': '/job-configuration',
  'quote-management': '/quote-management',
  'review': '/review',
  'payment': '/payment',
  'request-detail': '/request',
  'services': '/services',
  'market-benchmark': '/market-benchmark',
  'company-profile': '/company-profile',
  'help': '/help',
  'previous-vendors': '/vendors',
  'quick-rehire': '/quick-rehire',
  'view-offers': '/offers',
};

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const { 
    pushHistory, 
    popHistory, 
    setNavigationDirection,
    userType,
    navigationHistory,
  } = useAppStore();

  const navigateTo = useCallback((screen: ScreenType) => {
    const currentPath = window.location.pathname;
    const route = screenToRoute[screen] || '/';
    
    if (currentPath !== route) {
      // Get current screen type from path
      const currentScreen = Object.entries(screenToRoute).find(
        ([, path]) => path === currentPath
      )?.[0] as ScreenType | undefined;
      
      if (currentScreen) {
        pushHistory(currentScreen);
      }
      setNavigationDirection('forward');
      navigate(route);
    }
  }, [navigate, pushHistory, setNavigationDirection]);

  const goBack = useCallback(() => {
    setNavigationDirection('back');
    const lastScreen = popHistory();
    
    if (lastScreen) {
      const route = screenToRoute[lastScreen] || '/';
      navigate(route);
    } else {
      // Go to appropriate home
      navigate(userType === 'consumer' ? '/consumer' : userType === 'vendor' ? '/vendor' : '/');
    }
  }, [navigate, popHistory, setNavigationDirection, userType]);

  const canGoBack = useCallback(() => {
    return navigationHistory.length > 0;
  }, [navigationHistory]);

  return {
    navigateTo,
    goBack,
    canGoBack,
  };
};

export default useAppNavigation;
