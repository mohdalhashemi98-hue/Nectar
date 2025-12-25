import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { usePostJob } from '@/hooks/use-data-queries';
import Original from '@/components/stack/screens/JobConfigurationScreen';

const JobConfigurationScreen: React.FC = () => {
  const { requestDetails, setRequestDetails, selectedCategory, selectedSubService, resetRequestForm } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();
  const postJob = usePostJob();

  const handlePostJob = async (jobData: {
    title: string;
    description: string;
    category: string;
    budget: string;
    urgency: string;
  }) => {
    await postJob.mutateAsync(jobData);
  };

  return (
    <Original 
      requestDetails={requestDetails} 
      setRequestDetails={setRequestDetails} 
      selectedCategory={selectedCategory} 
      selectedSubService={selectedSubService} 
      onBack={goBack} 
      onNavigate={navigateTo} 
      onSubmit={resetRequestForm}
      onPostJob={handlePostJob}
    />
  );
};

export default JobConfigurationScreen;
