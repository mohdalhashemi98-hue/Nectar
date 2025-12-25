import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useAvailableJobs } from '@/hooks/use-data-queries';
import OriginalVendorWorkScreen from '@/components/stack/screens/VendorWorkScreen';
import { VendorHomeSkeleton } from '@/components/stack/ScreenSkeleton';

const VendorWorkScreen: React.FC = () => {
  const { setSelectedAvailableJob } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();

  const { data: availableJobs = [], isLoading } = useAvailableJobs();

  if (isLoading) {
    return <VendorHomeSkeleton />;
  }

  return (
    <OriginalVendorWorkScreen
      availableJobs={availableJobs}
      onBack={goBack}
      onNavigate={navigateTo}
      onSelectJob={setSelectedAvailableJob}
    />
  );
};

export default VendorWorkScreen;
