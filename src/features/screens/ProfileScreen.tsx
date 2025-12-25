// Quick re-exports to fix build - these wrap original screens with store/navigation
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useUserProfile, useRewards } from '@/hooks/use-data-queries';
import { supabase } from '@/integrations/supabase/client';
import Original from '@/components/stack/screens/ProfileScreen';

const ProfileScreen: React.FC = () => {
  const { userType, logout, setSelectedJob } = useAppStore();
  const { navigateTo } = useAppNavigation();
  const { data: userProfile } = useUserProfile();
  const { data: rewards } = useRewards();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/');
  };

  if (!userProfile || !rewards) return null;

  return (
    <Original
      userProfile={userProfile}
      rewards={rewards}
      userType={userType}
      onNavigate={navigateTo}
      onLogout={handleLogout}
      onSelectJob={setSelectedJob}
    />
  );
};

export default ProfileScreen;
