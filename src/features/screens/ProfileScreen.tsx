// Quick re-exports to fix build - these wrap original screens with store/navigation
import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useUserProfile, useRewards } from '@/hooks/use-data-queries';
import Original from '@/components/stack/screens/ProfileScreen';

const ProfileScreen: React.FC = () => {
  const { userType, logout, setSelectedJob } = useAppStore();
  const { navigateTo } = useAppNavigation();
  const { data: userProfile } = useUserProfile();
  const { data: rewards } = useRewards();

  if (!userProfile || !rewards) return null;

  return (
    <Original
      userProfile={userProfile}
      rewards={rewards}
      userType={userType}
      onNavigate={navigateTo}
      onLogout={logout}
      onSelectJob={setSelectedJob}
    />
  );
};

export default ProfileScreen;
