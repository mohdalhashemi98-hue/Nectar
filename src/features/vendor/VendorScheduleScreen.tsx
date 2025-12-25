import React from 'react';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import OriginalVendorScheduleScreen from '@/components/stack/screens/VendorScheduleScreen';

const VendorScheduleScreen: React.FC = () => {
  const { navigateTo, goBack } = useAppNavigation();

  return <OriginalVendorScheduleScreen onNavigate={navigateTo} onBack={goBack} />;
};

export default VendorScheduleScreen;
