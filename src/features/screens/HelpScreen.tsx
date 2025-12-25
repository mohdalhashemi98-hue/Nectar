import React from 'react';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import Original from '@/components/stack/screens/HelpScreen';

const HelpScreen: React.FC = () => {
  const { navigateTo, goBack } = useAppNavigation();
  return <Original onNavigate={navigateTo} onBack={goBack} />;
};

export default HelpScreen;
