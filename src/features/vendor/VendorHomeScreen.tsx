import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useVendorStats, useAvailableJobs } from '@/hooks/use-data-queries';
import OriginalVendorHomeScreen from '@/components/stack/screens/VendorHomeScreen';
import { VendorHomeSkeleton } from '@/components/stack/ScreenSkeleton';

const VendorHomeScreen: React.FC = () => {
  const { setSelectedAvailableJob } = useAppStore();
  const { navigateTo } = useAppNavigation();

  // React Query data fetching
  const { data: vendorStats, isLoading: statsLoading } = useVendorStats();
  const { data: availableJobs = [], isLoading: jobsLoading } = useAvailableJobs();

  const isLoading = statsLoading || jobsLoading;

  if (isLoading || !vendorStats) {
    return <VendorHomeSkeleton />;
  }

  return (
    <OriginalVendorHomeScreen
      vendorStats={vendorStats}
      availableJobs={availableJobs}
      onNavigate={navigateTo}
      onSelectJob={setSelectedAvailableJob}
    />
  );
};

export default VendorHomeScreen;
