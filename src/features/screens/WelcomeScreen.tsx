// Re-export screens from their original locations with adapter wrappers
// This allows gradual migration while maintaining the same component interfaces

import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';

// Import original screen components
import OriginalWelcomeScreen from '@/components/stack/screens/WelcomeScreen';

const WelcomeScreen: React.FC = () => {
  const { setUserType, isAuthenticated } = useAppStore();
  const { navigateTo } = useAppNavigation();

  const handleSelectUserType = (type: 'consumer' | 'vendor') => {
    setUserType(type);
    if (!isAuthenticated) {
      navigateTo('login');
    } else {
      navigateTo(type === 'consumer' ? 'consumer-home' : 'vendor-home');
    }
  };

  return <OriginalWelcomeScreen onSelectUserType={handleSelectUserType} />;
};

export default WelcomeScreen;
