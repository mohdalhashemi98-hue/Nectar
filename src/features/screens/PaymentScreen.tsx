import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import Original from '@/components/stack/screens/PaymentScreen';

const PaymentScreen: React.FC = () => {
  const { selectedJob } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();

  if (!selectedJob) { goBack(); return null; }

  return <Original job={selectedJob} onBack={goBack} onNavigate={navigateTo} onPaymentComplete={() => navigateTo('consumer-home')} />;
};

export default PaymentScreen;
