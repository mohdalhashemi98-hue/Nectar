import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import OriginalRequestDetailScreen from '@/components/stack/screens/RequestDetailScreen';

const RequestDetailScreen: React.FC = () => {
  const { selectedAvailableJob } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();

  if (!selectedAvailableJob) {
    // Redirect to vendor home if no job selected
    goBack();
    return null;
  }

  return (
    <OriginalRequestDetailScreen
      job={selectedAvailableJob}
      onBack={goBack}
      onNavigate={navigateTo}
    />
  );
};

export default RequestDetailScreen;
