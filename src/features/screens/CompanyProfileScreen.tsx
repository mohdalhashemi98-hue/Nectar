import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import Original from '@/components/stack/screens/CompanyProfileScreen';

const CompanyProfileScreen: React.FC = () => {
  const { userType } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();

  return <Original userType={userType} onBack={goBack} onNavigate={navigateTo} />;
};

export default CompanyProfileScreen;
