import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useNotifications, useJobs } from '@/hooks/use-data-queries';
import Original from '@/components/stack/screens/NotificationsScreen';

const NotificationsScreen: React.FC = () => {
  const { userType, setSelectedJob } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();
  const { data: notifications = [] } = useNotifications();
  const { data: jobs = [] } = useJobs();

  return (
    <Original
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
};

export default NotificationsScreen;
