import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  'vendor-onboarding': '/vendor/onboarding',
  'user-verification': '/verify',
};

// Map routes back to screen types
const routeToScreen: Record<string, ScreenType> = Object.entries(screenToRoute).reduce(
  (acc, [screen, route]) => ({ ...acc, [route]: screen as ScreenType }),
  {}
);

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    pushHistory, 
    popHistory, 
    setNavigationDirection,
    userType,
    navigationHistory,
  } = useAppStore();

  const navigateTo = useCallback((screen: ScreenType, params?: { id?: string | number }) => {
    let route = screenToRoute[screen] || '/';
    
    // Handle parameterized routes
    if (params?.id) {
      if (screen === 'vendor-profile') {
        route = `/vendor/profile/${params.id}`;
      } else if (screen === 'chat') {
        route = `/chat/${params.id}`;
      } else if (screen === 'job-detail') {
        route = `/job/${params.id}`;
      } else if (screen === 'quote-management') {
        route = `/quote-management/${params.id}`;
      } else if (screen === 'request-detail') {
        route = `/request/${params.id}`;
      }
    }
    
    const currentPath = location.pathname;
    
    if (currentPath !== route) {
      // Get current screen type from path
      const currentScreen = routeToScreen[currentPath] as ScreenType | undefined;
      
      if (currentScreen) {
        pushHistory(currentScreen);
      }
      setNavigationDirection('forward');
      navigate(route);
    }
  }, [navigate, location.pathname, pushHistory, setNavigationDirection]);

  const goBack = useCallback(() => {
    setNavigationDirection('back');
    popHistory();
    
    if (navigationHistory.length > 0) {
      navigate(-1);
    } else {
      // Go to appropriate home
      navigate(userType === 'consumer' ? '/consumer' : userType === 'vendor' ? '/vendor' : '/');
    }
  }, [navigate, popHistory, setNavigationDirection, userType, navigationHistory.length]);

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
