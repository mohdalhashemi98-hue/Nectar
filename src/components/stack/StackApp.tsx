import { useState, useRef, useMemo, useCallback, useEffect, Suspense } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { UserType, ScreenType, Vendor, Job, RequestDetails, Conversation, ReviewData, AvailableJob, Offer } from '@/types/stack';
import { 
  initialUserProfile, initialRewards, initialJobs, initialVendors, 
  initialConversations, initialNotifications, initialAvailableJobs, initialVendorStats 
} from '@/data/stack-data';

import { LazyScreens, preloadScreens, getPreloadTargets, preloadCriticalScreens } from './screenPreloader';
import ScreenFallback from './ScreenFallback';

// Aliases for cleaner JSX
const {
  LoginScreen,
  WelcomeScreen,
  ConsumerHomeScreen,
  VendorHomeScreen,
  VendorProfileScreen,
  VendorScheduleScreen,
  RewardsScreen,
  ProfileScreen,
  JobsScreen,
  JobDetailScreen,
  MessagesScreen,
  ChatScreen,
  CompanyProfileScreen,
  PostJobScreen,
  JobConfigurationScreen,
  ReviewScreen,
  NotificationsScreen,
  RequestDetailScreen,
  VendorWorkScreen,
  PaymentScreen,
  TransactionsScreen,
  QuoteManagementScreen,
  MarketBenchmarkScreen,
  HelpScreen,
  ServicesScreen,
} = LazyScreens;

const StackApp = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Navigation state
  const [userType, setUserType] = useState<UserType>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [navigationHistory, setNavigationHistory] = useState<ScreenType[]>([]);

  // Preload critical screens on mount
  useEffect(() => {
    preloadCriticalScreens();
  }, []);

  // Preload likely next screens when current screen changes
  useEffect(() => {
    const targets = getPreloadTargets(currentScreen, userType);
    if (targets.length > 0) {
      // Small delay to not block current render
      const timer = setTimeout(() => {
        preloadScreens(targets);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, userType]);

  // Data state
  const [userProfile] = useState(initialUserProfile);
  const [rewards] = useState(initialRewards);
  const [jobs] = useState(initialJobs);
  const [previousVendors] = useState(initialVendors);
  const [notifications] = useState(initialNotifications);
  const [availableJobs] = useState(initialAvailableJobs);
  const [vendorStats] = useState(initialVendorStats);

  // Selection state
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedAvailableJob, setSelectedAvailableJob] = useState<AvailableJob | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubService, setSelectedSubService] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [requestDetails, setRequestDetails] = useState<RequestDetails>({
    title: '', description: '', category: '', budget: '', urgency: 'flexible', photos: [], bookingType: 'one-time'
  });

  // Track navigation direction for animations
  const directionRef = useRef<'forward' | 'back'>('forward');

  const navigateTo = (screen: ScreenType) => {
    if (currentScreen !== screen) {
      directionRef.current = 'forward';
      setNavigationHistory(prev => [...prev, currentScreen]);
    }
    setCurrentScreen(screen);
  };

  const goBack = useCallback(() => {
    directionRef.current = 'back';
    if (navigationHistory.length > 0) {
      const newHistory = [...navigationHistory];
      const lastScreen = newHistory.pop();
      setNavigationHistory(newHistory);
      setCurrentScreen(lastScreen || 'welcome');
    } else {
      setCurrentScreen(userType === 'consumer' ? 'consumer-home' : userType === 'vendor' ? 'vendor-home' : 'welcome');
    }
  }, [navigationHistory, userType]);

  // Optimized animation variants for smooth screen transitions
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

  // Special fade-scale variant for modal-like screens
  const isModalScreen = ['review', 'payment', 'notifications', 'help'].includes(currentScreen);
  
  const fadeScaleVariants = useMemo(() => ({
    enter: {
      opacity: 0,
      scale: 0.96,
      y: 12,
    },
    center: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: 12,
    },
  }), []);

  const screenVariants = isModalScreen ? fadeScaleVariants : slideVariants;

  const resetRequestForm = () => {
    setRequestDetails({
      title: selectedSubService || selectedCategory || '', 
      description: '', 
      category: selectedCategory || '', 
      subService: selectedSubService || '',
      budget: '', 
      urgency: 'flexible', 
      photos: [], 
      bookingType: 'one-time'
    });
  };

  const handleSelectSubService = (category: string, subService: string) => {
    setSelectedCategory(category);
    setSelectedSubService(subService);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setCurrentScreen('welcome');
    setNavigationHistory([]);
  };

  const handleSelectUserType = (type: UserType) => {
    setUserType(type);
    if (!isAuthenticated) {
      setCurrentScreen('login' as ScreenType);
    } else {
      setCurrentScreen(type === 'consumer' ? 'consumer-home' : 'vendor-home');
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen(userType === 'consumer' ? 'consumer-home' : 'vendor-home');
  };

  // Render main screens
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onSelectUserType={handleSelectUserType} />;
      
      case 'login':
        return (
          <LoginScreen 
            onLogin={handleLogin}
            onSignup={handleLogin}
            onBack={() => setCurrentScreen('welcome')}
            userType={userType}
          />
        );
      
      case 'consumer-home':
        return (
          <ConsumerHomeScreen
            userProfile={userProfile}
            rewards={rewards}
            previousVendors={previousVendors}
            jobs={jobs}
            notifications={notifications}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNavigate={navigateTo}
            onSelectCategory={setSelectedCategory}
            onSelectVendor={setSelectedVendor}
            onSelectJob={setSelectedJob}
            onResetRequestForm={resetRequestForm}
          />
        );
      
      case 'vendor-home':
        return (
          <VendorHomeScreen
            vendorStats={vendorStats}
            availableJobs={availableJobs}
            onNavigate={navigateTo}
            onSelectJob={(job) => setSelectedAvailableJob(job)}
          />
        );
      
      case 'vendor-schedule':
        return (
          <VendorScheduleScreen
            onNavigate={navigateTo}
          />
        );
      
      case 'vendor-profile':
        // If vendor is viewing their own profile preview, show it with mock data
        if (userType === 'vendor' && !selectedVendor) {
          const vendorSelfView: Vendor = {
            id: 0,
            name: 'Al-Mansouri Services',
            avatar: 'AM',
            rating: 4.9,
            reviews: 156,
            specialty: 'HVAC & AC Services',
            verified: true,
            favorite: false,
            lastJob: '',
            completedJobs: 500,
            lastJobDate: '',
            responseTime: '12 min',
            distance: '',
            avgPrice: '',
            completionRate: 98,
            phone: ''
          };
          return (
            <VendorProfileScreen
              vendor={vendorSelfView}
              onBack={goBack}
              onNavigate={navigateTo}
              onStartChat={(conv) => {
                setConversations(prev => [conv, ...prev]);
                setSelectedConversation(conv);
              }}
            />
          );
        }
        return selectedVendor ? (
          <VendorProfileScreen
            vendor={selectedVendor}
            onBack={goBack}
            onNavigate={navigateTo}
            onStartChat={(conv) => {
              setConversations(prev => [conv, ...prev]);
              setSelectedConversation(conv);
            }}
          />
        ) : (
          <ConsumerHomeScreen
            userProfile={userProfile}
            rewards={rewards}
            previousVendors={previousVendors}
            jobs={jobs}
            notifications={notifications}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNavigate={navigateTo}
            onSelectCategory={setSelectedCategory}
            onSelectVendor={setSelectedVendor}
            onSelectJob={setSelectedJob}
            onResetRequestForm={resetRequestForm}
          />
        );
      
      case 'rewards':
        return (
          <RewardsScreen
            rewards={rewards}
            userType={userType}
            onBack={goBack}
            onNavigate={navigateTo}
          />
        );
      
      case 'company-profile':
        return (
          <CompanyProfileScreen
            userType={userType}
            onBack={goBack}
            onNavigate={navigateTo}
          />
        );
      
      case 'profile':
        return (
          <ProfileScreen
            userProfile={userProfile}
            rewards={rewards}
            userType={userType}
            onNavigate={navigateTo}
            onLogout={handleLogout}
            onSelectJob={setSelectedJob}
          />
        );
      
      case 'notifications':
        return (
          <NotificationsScreen
            notifications={notifications}
            userType={userType}
            onBack={goBack}
            onNavigate={navigateTo}
            onSelectJobForQuotes={(jobId) => {
              const job = jobs.find(j => j.id === jobId);
              if (job) setSelectedJob(job);
            }}
          />
        );
      
      case 'transactions':
        return userType === 'vendor' ? (
          <VendorWorkScreen
            availableJobs={availableJobs}
            onBack={goBack}
            onNavigate={navigateTo}
            onSelectJob={(job) => {
              setSelectedAvailableJob(job);
            }}
          />
        ) : (
          <TransactionsScreen
            onBack={goBack}
            onNavigate={navigateTo}
          />
        );
      
      case 'job-detail':
        return selectedJob ? (
          <JobDetailScreen
            job={selectedJob}
            vendor={previousVendors.find(v => v.id === selectedJob.vendorId) || null}
            userType={userType}
            onBack={goBack}
            onNavigate={navigateTo}
            onStartChat={() => {
              const existingConv = conversations.find(c => c.name === selectedJob.vendor);
              if (existingConv) {
                setSelectedConversation(existingConv);
              } else if (selectedJob.vendor) {
                const newConv = {
                  id: Date.now(),
                  name: selectedJob.vendor,
                  avatar: selectedJob.vendor.charAt(0),
                  lastMessage: '',
                  time: 'Now',
                  unread: false,
                  online: true,
                  messages: []
                };
                setConversations(prev => [newConv, ...prev]);
                setSelectedConversation(newConv);
              }
              navigateTo('chat');
            }}
          />
        ) : (
          <JobsScreen
            jobs={jobs}
            userType={userType}
            onBack={goBack}
            onNavigate={navigateTo}
            onSelectJob={(job) => {
              setSelectedJob(job);
              navigateTo('job-detail');
            }}
          />
        );
      
      case 'messages-list':
        return (
          <MessagesScreen
            conversations={conversations}
            userType={userType}
            onBack={goBack}
            onNavigate={navigateTo}
            onSelectConversation={(conv) => {
              setSelectedConversation(conv);
              navigateTo('chat');
            }}
          />
        );
      
      case 'chat':
        return selectedConversation ? (
          <ChatScreen
            conversation={selectedConversation}
            onBack={goBack}
            onNavigate={navigateTo}
          />
        ) : (
          <MessagesScreen
            conversations={conversations}
            userType={userType}
            onBack={goBack}
            onNavigate={navigateTo}
            onSelectConversation={(conv) => {
              setSelectedConversation(conv);
              navigateTo('chat');
            }}
          />
        );
      
      case 'post-request':
        return (
          <PostJobScreen
            requestDetails={requestDetails}
            setRequestDetails={setRequestDetails}
            selectedCategory={selectedCategory}
            onBack={goBack}
            onNavigate={navigateTo}
            onSubmit={resetRequestForm}
          />
        );
      
      case 'review':
        return selectedJob ? (
          <ReviewScreen
            job={selectedJob}
            onBack={goBack}
            onNavigate={navigateTo}
            onSubmitReview={(review) => {
              console.log('Review submitted:', review);
              navigateTo('consumer-home');
            }}
          />
        ) : (
          <JobsScreen
            jobs={jobs}
            userType={userType}
            onBack={goBack}
            onNavigate={navigateTo}
            onSelectJob={setSelectedJob}
          />
        );
      
      case 'request-detail':
        return selectedAvailableJob ? (
          <RequestDetailScreen
            job={selectedAvailableJob}
            onBack={goBack}
            onNavigate={navigateTo}
          />
        ) : (
          <VendorHomeScreen
            vendorStats={vendorStats}
            availableJobs={availableJobs}
            onNavigate={navigateTo}
            onSelectJob={(job) => setSelectedAvailableJob(job)}
          />
        );
      
      case 'payment':
        return selectedJob ? (
          <PaymentScreen
            job={selectedJob}
            onBack={goBack}
            onNavigate={navigateTo}
            onPaymentComplete={() => {
              navigateTo('consumer-home');
            }}
          />
        ) : (
          <JobsScreen
            jobs={jobs}
            userType={userType}
            onBack={goBack}
            onNavigate={navigateTo}
            onSelectJob={(job) => {
              setSelectedJob(job);
              navigateTo('payment');
            }}
          />
        );
      
      case 'quote-management':
        return selectedJob ? (
          <QuoteManagementScreen
            job={selectedJob}
            onBack={goBack}
            onNavigate={navigateTo}
            onSelectVendorId={(vendorId) => {
              const vendor = previousVendors.find(v => v.id === vendorId);
              if (vendor) setSelectedVendor(vendor);
            }}
            onStartChatWithVendor={(vendorId) => {
              const vendor = previousVendors.find(v => v.id === vendorId);
              if (vendor) {
                const existingConv = conversations.find(c => c.name === vendor.name);
                if (existingConv) {
                  setSelectedConversation(existingConv);
                } else {
                  const newConv = {
                    id: Date.now(),
                    name: vendor.name,
                    avatar: vendor.avatar,
                    lastMessage: '',
                    time: 'Now',
                    unread: false,
                    online: true,
                    messages: []
                  };
                  setConversations(prev => [newConv, ...prev]);
                  setSelectedConversation(newConv);
                }
              }
            }}
            onAcceptOffer={(offer: Offer) => {
              // Update the job with vendor info
              console.log('Accepted offer:', offer);
              navigateTo('consumer-home');
            }}
          />
        ) : (
          <JobsScreen
            jobs={jobs}
            userType={userType}
            onBack={goBack}
            onNavigate={navigateTo}
            onSelectJob={(job) => {
              setSelectedJob(job);
              navigateTo('quote-management');
            }}
          />
        );
      
      case 'market-benchmark':
        return (
          <MarketBenchmarkScreen
            onNavigate={navigateTo}
            onSelectCategory={setSelectedCategory}
            onResetRequestForm={resetRequestForm}
          />
        );
      
      case 'help':
        return (
          <HelpScreen
            onNavigate={navigateTo}
          />
        );
      
      case 'services':
        return (
          <ServicesScreen
            onNavigate={navigateTo}
            onSelectCategory={setSelectedCategory}
            onSelectSubService={handleSelectSubService}
            onResetRequestForm={resetRequestForm}
          />
        );
      
      case 'job-configuration':
        return (
          <JobConfigurationScreen
            requestDetails={requestDetails}
            setRequestDetails={setRequestDetails}
            selectedCategory={selectedCategory}
            selectedSubService={selectedSubService}
            onBack={goBack}
            onNavigate={navigateTo}
            onSubmit={resetRequestForm}
          />
        );
      
      default:
        return <WelcomeScreen onSelectUserType={handleSelectUserType} />;
    }
  };

  // Optimized transition config
  const transitionConfig = useMemo(() => isModalScreen ? {
    type: 'tween' as const,
    duration: 0.2,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  } : {
    type: 'tween' as const,
    duration: 0.2,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  }, [isModalScreen]);

  // Check if current screen can go back (has navigation history or is not a home screen)
  const canSwipeBack = useMemo(() => {
    const homeScreens: ScreenType[] = ['welcome', 'login', 'consumer-home', 'vendor-home'];
    return !homeScreens.includes(currentScreen) && navigationHistory.length > 0;
  }, [currentScreen, navigationHistory.length]);

  // Swipe progress tracking
  const dragX = useMotionValue(0);
  const swipeProgress = useTransform(dragX, [0, 150], [0, 1]);
  const indicatorOpacity = useTransform(dragX, [0, 50, 150], [0, 0.8, 1]);
  const indicatorScale = useTransform(dragX, [0, 100, 150], [0.5, 0.9, 1]);
  const shadowOpacity = useTransform(dragX, [0, 150], [0, 0.3]);

  // Handle swipe gesture
  const handleDragEnd = useCallback((event: any, info: any) => {
    const threshold = 100; // minimum swipe distance
    const velocity = 500; // minimum velocity
    
    if (canSwipeBack && info.offset.x > threshold && info.velocity.x > velocity) {
      goBack();
    }
  }, [canSwipeBack, goBack]);

  return (
    <div className="screen-container shadow-2xl overflow-hidden relative">
      {/* Swipe back indicator */}
      {canSwipeBack && (
        <>
          {/* Left edge shadow during swipe */}
          <motion.div
            className="absolute inset-y-0 left-0 w-16 pointer-events-none z-50"
            style={{
              background: 'linear-gradient(to right, hsl(var(--foreground) / 0.15), transparent)',
              opacity: shadowOpacity,
            }}
          />
          
          {/* Back arrow indicator */}
          <motion.div
            className="absolute left-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
            style={{
              opacity: indicatorOpacity,
              scale: indicatorScale,
            }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <ChevronLeft className="w-6 h-6 text-primary-foreground" />
            </div>
          </motion.div>
          
          {/* Progress arc around indicator */}
          <motion.svg
            className="absolute left-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none w-10 h-10"
            style={{
              opacity: indicatorOpacity,
              scale: indicatorScale,
            }}
            viewBox="0 0 40 40"
          >
            <motion.circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                pathLength: swipeProgress,
                rotate: -90,
                transformOrigin: 'center',
              }}
              strokeDasharray="1"
              strokeDashoffset="0"
            />
          </motion.svg>
        </>
      )}
      
      <Suspense fallback={<ScreenFallback />}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentScreen}
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
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default StackApp;
