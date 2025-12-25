import React, { Suspense, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAppStore } from '@/stores/app-store';
import { ScreenType } from '@/types/stack';
import ScreenFallback from '@/components/stack/ScreenFallback';
import { preloadCriticalScreens, preloadScreens, getPreloadTargets } from '@/components/stack/screenPreloader';

// Map routes to screen types for animation logic
const routeToScreen: Record<string, ScreenType> = {
  '/': 'welcome',
  '/login': 'login',
  '/consumer': 'consumer-home',
  '/vendor': 'vendor-home',
  '/vendor/schedule': 'vendor-schedule',
  '/vendor/profile': 'vendor-profile',
  '/profile': 'profile',
  '/rewards': 'rewards',
  '/notifications': 'notifications',
  '/messages': 'messages-list',
  '/chat': 'chat',
  '/jobs': 'transactions',
  '/job': 'job-detail',
  '/post-request': 'post-request',
  '/job-configuration': 'job-configuration',
  '/quote-management': 'quote-management',
  '/review': 'review',
  '/payment': 'payment',
  '/request': 'request-detail',
  '/services': 'services',
  '/market-benchmark': 'market-benchmark',
  '/company-profile': 'company-profile',
  '/help': 'help',
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { navigationDirection, userType, navigationHistory, popHistory, setNavigationDirection } = useAppStore();
  const directionRef = useRef<'forward' | 'back'>(navigationDirection);

  // Update direction ref when store changes
  useEffect(() => {
    directionRef.current = navigationDirection;
  }, [navigationDirection]);

  // Get current screen type from route
  const currentScreen = useMemo(() => {
    const path = location.pathname;
    // Check exact match first
    if (routeToScreen[path]) return routeToScreen[path];
    // Check prefix matches
    for (const [route, screen] of Object.entries(routeToScreen)) {
      if (path.startsWith(route) && route !== '/') return screen;
    }
    return 'welcome';
  }, [location.pathname]);

  // Preload critical screens on mount
  useEffect(() => {
    preloadCriticalScreens();
  }, []);

  // Preload likely next screens when current screen changes
  useEffect(() => {
    const targets = getPreloadTargets(currentScreen, userType);
    if (targets.length > 0) {
      const timer = setTimeout(() => {
        preloadScreens(targets);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, userType]);

  // Animation variants
  const isModalScreen = ['review', 'payment', 'notifications', 'help'].includes(currentScreen);

  const slideVariants = useMemo(() => ({
    enter: (direction: 'forward' | 'back') => ({
      x: direction === 'forward' ? '40%' : '-20%',
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: 'forward' | 'back') => ({
      x: direction === 'forward' ? '-20%' : '40%',
      opacity: 0,
      scale: 0.98,
    }),
  }), []);

  const fadeScaleVariants = useMemo(() => ({
    enter: { opacity: 0, scale: 0.96, y: 12 },
    center: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: 12 },
  }), []);

  const screenVariants = isModalScreen ? fadeScaleVariants : slideVariants;

  const transitionConfig = useMemo(() => ({
    type: 'tween' as const,
    duration: 0.2,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  }), []);

  // Swipe back logic
  const homeRoutes = ['/', '/login', '/consumer', '/vendor'];
  const canSwipeBack = !homeRoutes.includes(location.pathname) && navigationHistory.length > 0;

  const goBack = useCallback(() => {
    setNavigationDirection('back');
    const lastScreen = popHistory();
    if (lastScreen) {
      navigate(-1);
    } else {
      navigate(userType === 'consumer' ? '/consumer' : userType === 'vendor' ? '/vendor' : '/');
    }
  }, [navigate, popHistory, setNavigationDirection, userType]);

  // Swipe progress tracking
  const dragX = useMotionValue(0);
  const swipeProgress = useTransform(dragX, [0, 150], [0, 1]);
  const indicatorOpacity = useTransform(dragX, [0, 50, 150], [0, 0.8, 1]);
  const indicatorScale = useTransform(dragX, [0, 100, 150], [0.5, 0.9, 1]);
  const shadowOpacity = useTransform(dragX, [0, 150], [0, 0.3]);

  const handleDragEnd = useCallback((event: any, info: any) => {
    const threshold = 100;
    const velocity = 500;
    
    if (canSwipeBack && info.offset.x > threshold && info.velocity.x > velocity) {
      goBack();
    }
  }, [canSwipeBack, goBack]);

  return (
    <div className="screen-container shadow-2xl overflow-hidden relative">
      {/* Swipe back indicator */}
      {canSwipeBack && (
        <>
          <motion.div
            className="absolute inset-y-0 left-0 w-16 pointer-events-none z-50"
            style={{
              background: 'linear-gradient(to right, hsl(var(--foreground) / 0.15), transparent)',
              opacity: shadowOpacity,
            }}
          />
          
          <motion.div
            className="absolute left-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
            style={{ opacity: indicatorOpacity, scale: indicatorScale }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <ChevronLeft className="w-6 h-6 text-primary-foreground" />
            </div>
          </motion.div>
          
          <motion.svg
            className="absolute left-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none w-10 h-10"
            style={{ opacity: indicatorOpacity, scale: indicatorScale }}
            viewBox="0 0 40 40"
          >
            <motion.circle
              cx="20" cy="20" r="18"
              fill="none"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: swipeProgress, rotate: -90, transformOrigin: 'center' }}
              strokeDasharray="1"
              strokeDashoffset="0"
            />
          </motion.svg>
        </>
      )}
      
      <Suspense fallback={<ScreenFallback />}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={location.pathname}
            custom={directionRef.current}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transitionConfig}
            drag={canSwipeBack ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.5 }}
            onDragEnd={handleDragEnd}
            style={{ 
              x: dragX,
              willChange: 'transform, opacity',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
            className="w-full h-full touch-pan-y"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default AppLayout;
