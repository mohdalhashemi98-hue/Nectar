import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useRewards } from '@/hooks/use-data-queries';
import Original from '@/components/stack/screens/RewardsScreen';

const RewardsScreen: React.FC = () => {
  const { userType } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();
  const { data: rewards } = useRewards();

  if (!rewards) return null;

  return <Original rewards={rewards} userType={userType} onBack={goBack} onNavigate={navigateTo} />;
};

export default RewardsScreen;
