import React from 'react';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import VendorOnboardingScreen from '@/components/vendor-onboarding/VendorOnboardingScreen';

const VendorOnboarding: React.FC = () => {
  const { navigateTo, goBack } = useAppNavigation();

  return (
    <VendorOnboardingScreen 
      onComplete={() => navigateTo('vendor-home')} 
      onBack={goBack} 
    />
  );
};

export default VendorOnboarding;
