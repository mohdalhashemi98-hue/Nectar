import React from 'react';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import OriginalVendorScheduleScreen from '@/components/stack/screens/VendorScheduleScreen';

const VendorScheduleScreen: React.FC = () => {
  const { navigateTo } = useAppNavigation();

  return <OriginalVendorScheduleScreen onNavigate={navigateTo} />;
};

export default VendorScheduleScreen;
