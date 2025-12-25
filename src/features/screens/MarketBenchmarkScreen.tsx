import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import Original from '@/components/stack/screens/MarketBenchmarkScreen';

const MarketBenchmarkScreen: React.FC = () => {
  const { setSelectedCategory, resetRequestForm } = useAppStore();
  const { navigateTo } = useAppNavigation();

  return <Original onNavigate={navigateTo} onSelectCategory={setSelectedCategory} onResetRequestForm={resetRequestForm} />;
};

export default MarketBenchmarkScreen;
