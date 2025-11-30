import { useState } from 'react';
import { UserType, ScreenType, Vendor, Job, RequestDetails } from '@/types/mazaadi';
import { 
  initialUserProfile, initialRewards, initialJobs, initialVendors, 
  initialConversations, initialNotifications, initialAvailableJobs, initialVendorStats 
} from '@/data/mazaadi-data';

import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ConsumerHomeScreen from './screens/ConsumerHomeScreen';
import VendorHomeScreen from './screens/VendorHomeScreen';
import RewardsScreen from './screens/RewardsScreen';
import ProfileScreen from './screens/ProfileScreen';

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

  // Render auth screen
  if (!isAuthenticated) {
    return (
      <LoginScreen 
        onLogin={() => { setIsAuthenticated(true); setCurrentScreen('welcome'); }}
        onSignup={() => { setIsAuthenticated(true); setCurrentScreen('welcome'); }}
      />
    );
  }

  // Render main screens
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onSelectUserType={setUserType} onNavigate={navigateTo} />;
      
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
      
      case 'rewards':
        return (
          <RewardsScreen
            rewards={rewards}
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
      
      default:
        return <WelcomeScreen onSelectUserType={setUserType} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen shadow-2xl">
      {renderScreen()}
    </div>
  );
};

export default MazaadiApp;
