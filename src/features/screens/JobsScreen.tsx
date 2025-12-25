import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useJobs } from '@/hooks/use-data-queries';
import Original from '@/components/stack/screens/JobsScreen';

const JobsScreen: React.FC = () => {
  const { userType, setSelectedJob } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();
  const { data: jobs = [] } = useJobs();

  return <Original jobs={jobs} userType={userType} onBack={goBack} onNavigate={navigateTo} onSelectJob={setSelectedJob} />;
};

export default JobsScreen;
