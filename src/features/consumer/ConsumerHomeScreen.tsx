import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useUserProfile, useRewards, useVendors, useJobs, useNotifications } from '@/hooks/use-data-queries';
import OriginalConsumerHomeScreen from '@/components/stack/screens/ConsumerHomeScreen';
import { ConsumerHomeSkeleton } from '@/components/stack/ScreenSkeleton';

const ConsumerHomeScreen: React.FC = () => {
  const { 
    searchQuery, setSearchQuery, 
    setSelectedCategory, setSelectedVendor, setSelectedJob,
    resetRequestForm,
  } = useAppStore();
  const { navigateTo } = useAppNavigation();

  // React Query data fetching
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: rewards, isLoading: rewardsLoading } = useRewards();
  const { data: previousVendors = [], isLoading: vendorsLoading } = useVendors();
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { data: notifications = [], isLoading: notificationsLoading } = useNotifications();

  const isLoading = profileLoading || rewardsLoading || vendorsLoading || jobsLoading || notificationsLoading;

  if (isLoading || !userProfile || !rewards) {
    return <ConsumerHomeSkeleton />;
  }

  // Filter vendors for recommended (non-favorite) vs previous (favorite)
  const recommendedVendors = previousVendors.filter(v => !v.favorite);
  const favoriteVendors = previousVendors.filter(v => v.favorite);

  return (
    <OriginalConsumerHomeScreen
      userProfile={userProfile}
      rewards={rewards}
      previousVendors={favoriteVendors}
      recommendedVendors={recommendedVendors}
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
};

export default ConsumerHomeScreen;
