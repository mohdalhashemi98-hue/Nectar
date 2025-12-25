import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import Original from '@/components/stack/screens/TransactionsScreen';

const TransactionsScreen: React.FC = () => {
  const { navigateTo, goBack } = useAppNavigation();

  return <Original onBack={goBack} onNavigate={navigateTo} />;
};

export default TransactionsScreen;
