import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useRewards } from '@/hooks/use-data-queries';
import Original from '@/components/stack/screens/RewardsScreen';

const RewardsScreen: React.FC = () => {
  const { userType } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();
  const { data: rewards } = useRewards();

  if (!rewards) return (
    <div className="flex flex-col h-full bg-background items-center justify-center">
      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
        <div className="w-6 h-6 rounded-lg bg-primary/40" />
      </div>
    </div>
  );

  return <Original rewards={rewards} userType={userType} onBack={goBack} onNavigate={navigateTo} />;
};

export default RewardsScreen;
