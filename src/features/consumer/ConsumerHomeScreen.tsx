import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useUserProfile, useRewards, useVendors, useJobs, useNotifications, useFavoriteVendorIds, useToggleFavorite } from '@/hooks/use-data-queries';
import OriginalConsumerHomeScreen from '@/components/stack/screens/ConsumerHomeScreen';
import { ConsumerHomeSkeleton } from '@/components/stack/ScreenSkeleton';
import { Vendor } from '@/types/stack';

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
  const { data: allVendors = [], isLoading: vendorsLoading } = useVendors();
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { data: notifications = [], isLoading: notificationsLoading } = useNotifications();
  const { data: favoriteIds = new Set<string>() } = useFavoriteVendorIds();
  const toggleFavorite = useToggleFavorite();

  const isLoading = profileLoading || rewardsLoading || vendorsLoading || jobsLoading || notificationsLoading;

  if (isLoading || !userProfile || !rewards) {
    return <ConsumerHomeSkeleton />;
  }

  // Mark vendors as favorites based on user's favorites list
  const vendorsWithFavorites = allVendors.map(v => ({
    ...v,
    favorite: favoriteIds.has(String(v.id))
  }));

  // Split into favorite and recommended vendors
  const favoriteVendors = vendorsWithFavorites.filter(v => v.favorite);
  const recommendedVendors = vendorsWithFavorites.filter(v => !v.favorite);

  const handleToggleFavorite = (vendor: Vendor) => {
    const vendorId = String(vendor.id);
    const isFavorite = favoriteIds.has(vendorId);
    toggleFavorite.mutate({ vendorId, isFavorite });
  };

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
      onToggleFavorite={handleToggleFavorite}
      favoriteIds={favoriteIds}
    />
  );
};

export default ConsumerHomeScreen;
