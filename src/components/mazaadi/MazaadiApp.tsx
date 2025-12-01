import { useState } from 'react';
import { UserType, ScreenType, Vendor, Job, RequestDetails, Conversation, ReviewData } from '@/types/mazaadi';
import { 
  initialUserProfile, initialRewards, initialJobs, initialVendors, 
  initialConversations, initialNotifications, initialAvailableJobs, initialVendorStats 
} from '@/data/mazaadi-data';

import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ConsumerHomeScreen from './screens/ConsumerHomeScreen';
import VendorHomeScreen from './screens/VendorHomeScreen';
import VendorProfileScreen from './screens/VendorProfileScreen';
import RewardsScreen from './screens/RewardsScreen';
import ProfileScreen from './screens/ProfileScreen';
import JobsScreen from './screens/JobsScreen';
import JobDetailScreen from './screens/JobDetailScreen';
import MessagesScreen from './screens/MessagesScreen';
import ChatScreen from './screens/ChatScreen';
import CompanyProfileScreen from './screens/CompanyProfileScreen';
import PostJobScreen from './screens/PostJobScreen';
import ReviewScreen from './screens/ReviewScreen';

const MazaadiApp = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Navigation state
  const [userType, setUserType] = useState<UserType>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [navigationHistory, setNavigationHistory] = useState<ScreenType[]>([]);

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [requestDetails, setRequestDetails] = useState<RequestDetails>({
    title: '', description: '', category: '', budget: '', urgency: 'flexible', photos: []
  });

  const navigateTo = (screen: ScreenType) => {
    if (currentScreen !== screen) {
      setNavigationHistory(prev => [...prev, currentScreen]);
    }
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const newHistory = [...navigationHistory];
      const lastScreen = newHistory.pop();
      setNavigationHistory(newHistory);
      setCurrentScreen(lastScreen || 'welcome');
    } else {
      setCurrentScreen(userType === 'consumer' ? 'consumer-home' : userType === 'vendor' ? 'vendor-home' : 'welcome');
    }
  };

  const resetRequestForm = () => {
    setRequestDetails({
      title: '', description: '', category: selectedCategory || '', budget: '', urgency: 'flexible', photos: []
    });
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
            onSelectJob={(job) => setSelectedJob(job as any)}
          />
        );
      
      case 'vendor-profile':
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
          />
        );
      
      case 'transactions':
        return (
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
      
      case 'job-detail':
        return selectedJob ? (
          <JobDetailScreen
            job={selectedJob}
            vendor={previousVendors.find(v => v.id === selectedJob.vendorId) || null}
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
      
      default:
        return <WelcomeScreen onSelectUserType={handleSelectUserType} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen shadow-2xl">
      {renderScreen()}
    </div>
  );
};

export default MazaadiApp;
