import React, { Suspense, lazy, useCallback, useMemo, useRef, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { ScreenType } from '@/types/stack';
import ScreenFallback from '@/components/stack/ScreenFallback';
import { preloadCriticalScreens, preloadScreens, getPreloadTargets } from '@/components/stack/screenPreloader';

// Lazy load all screens from features folder
const WelcomeScreen = lazy(() => import('@/features/screens/WelcomeScreen'));
const LoginScreen = lazy(() => import('@/features/screens/LoginScreen'));
const ConsumerHomeScreen = lazy(() => import('@/features/consumer/ConsumerHomeScreen'));
const VendorHomeScreen = lazy(() => import('@/features/vendor/VendorHomeScreen'));
const VendorScheduleScreen = lazy(() => import('@/features/vendor/VendorScheduleScreen'));
const VendorProfileScreen = lazy(() => import('@/features/vendor/VendorProfileScreen'));
const ProfileScreen = lazy(() => import('@/features/screens/ProfileScreen'));
const RewardsScreen = lazy(() => import('@/features/screens/RewardsScreen'));
const NotificationsScreen = lazy(() => import('@/features/screens/NotificationsScreen'));
const MessagesScreen = lazy(() => import('@/features/screens/MessagesScreen'));
const ChatScreen = lazy(() => import('@/features/screens/ChatScreen'));
const JobsScreen = lazy(() => import('@/features/screens/JobsScreen'));
const JobDetailScreen = lazy(() => import('@/features/screens/JobDetailScreen'));
const PostJobScreen = lazy(() => import('@/features/consumer/PostJobScreen'));
const JobConfigurationScreen = lazy(() => import('@/features/consumer/JobConfigurationScreen'));
const QuoteManagementScreen = lazy(() => import('@/features/consumer/QuoteManagementScreen'));
const ReviewScreen = lazy(() => import('@/features/screens/ReviewScreen'));
const PaymentScreen = lazy(() => import('@/features/screens/PaymentScreen'));
const RequestDetailScreen = lazy(() => import('@/features/vendor/RequestDetailScreen'));
const ServicesScreen = lazy(() => import('@/features/screens/ServicesScreen'));
const MarketBenchmarkScreen = lazy(() => import('@/features/screens/MarketBenchmarkScreen'));
const CompanyProfileScreen = lazy(() => import('@/features/screens/CompanyProfileScreen'));
const HelpScreen = lazy(() => import('@/features/screens/HelpScreen'));
const TransactionsScreen = lazy(() => import('@/features/screens/TransactionsScreen'));
const VendorWorkScreen = lazy(() => import('@/features/vendor/VendorWorkScreen'));

// Map routes to screen types for animation logic
const routeToScreen: Record<string, ScreenType> = {
  '/': 'welcome',
  '/login': 'login',
  '/consumer': 'consumer-home',
  '/vendor': 'vendor-home',
  '/vendor/schedule': 'vendor-schedule',
  '/vendor/profile-preview': 'vendor-profile',
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

const StackAppRouter: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    navigationDirection, 
    userType, 
    navigationHistory, 
    popHistory, 
    setNavigationDirection 
  } = useAppStore();
  
  const directionRef = useRef<'forward' | 'back'>(navigationDirection);

  // Update direction ref when store changes
  useEffect(() => {
    directionRef.current = navigationDirection;
  }, [navigationDirection]);

  // Get current screen type from route
  const currentScreen = useMemo(() => {
    const path = location.pathname;
    if (routeToScreen[path]) return routeToScreen[path];
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
    center: { x: 0, opacity: 1, scale: 1 },
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
    popHistory();
    navigate(-1);
  }, [navigate, popHistory, setNavigationDirection]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      setNavigationDirection('back');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setNavigationDirection]);

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
            <Routes location={location}>
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/consumer" element={<ConsumerHomeScreen />} />
              <Route path="/vendor" element={<VendorHomeScreen />} />
              <Route path="/vendor/schedule" element={<VendorScheduleScreen />} />
              <Route path="/vendor/profile-preview" element={<VendorProfileScreen />} />
              <Route path="/vendor/profile/:id" element={<VendorProfileScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/rewards" element={<RewardsScreen />} />
              <Route path="/notifications" element={<NotificationsScreen />} />
              <Route path="/messages" element={<MessagesScreen />} />
              <Route path="/chat" element={<ChatScreen />} />
              <Route path="/chat/:id" element={<ChatScreen />} />
              <Route path="/jobs" element={<JobsScreen />} />
              <Route path="/job" element={<JobDetailScreen />} />
              <Route path="/job/:id" element={<JobDetailScreen />} />
              <Route path="/post-request" element={<PostJobScreen />} />
              <Route path="/job-configuration" element={<JobConfigurationScreen />} />
              <Route path="/quote-management" element={<QuoteManagementScreen />} />
              <Route path="/quote-management/:id" element={<QuoteManagementScreen />} />
              <Route path="/review" element={<ReviewScreen />} />
              <Route path="/review/:id" element={<ReviewScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/payment/:id" element={<PaymentScreen />} />
              <Route path="/request" element={<RequestDetailScreen />} />
              <Route path="/request/:id" element={<RequestDetailScreen />} />
              <Route path="/services" element={<ServicesScreen />} />
              <Route path="/market-benchmark" element={<MarketBenchmarkScreen />} />
              <Route path="/company-profile" element={<CompanyProfileScreen />} />
              <Route path="/help" element={<HelpScreen />} />
              <Route path="/transactions" element={<TransactionsScreen />} />
              <Route path="/vendor-work" element={<VendorWorkScreen />} />
              <Route path="*" element={<WelcomeScreen />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default StackAppRouter;