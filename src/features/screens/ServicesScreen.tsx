import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import Original from '@/components/stack/screens/ServicesScreen';

const ServicesScreen: React.FC = () => {
  const { setSelectedCategory, setSelectedSubService, resetRequestForm } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();

  return <Original onNavigate={navigateTo} onBack={goBack} onSelectCategory={setSelectedCategory} onSelectSubService={(cat, sub) => { setSelectedCategory(cat); setSelectedSubService(sub); }} onResetRequestForm={resetRequestForm} />;
};

export default ServicesScreen;
