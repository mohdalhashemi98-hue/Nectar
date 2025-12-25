import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import Original from '@/components/stack/screens/PostJobScreen';

const PostJobScreen: React.FC = () => {
  const { requestDetails, setRequestDetails, selectedCategory, resetRequestForm } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();

  return <Original requestDetails={requestDetails} setRequestDetails={setRequestDetails} selectedCategory={selectedCategory} onBack={goBack} onNavigate={navigateTo} onSubmit={resetRequestForm} />;
};

export default PostJobScreen;
