import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import OriginalLoginScreen from '@/components/stack/screens/LoginScreen';

const LoginScreen: React.FC = () => {
  const { login, userType } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();

  const handleLogin = () => {
    login();
    navigateTo(userType === 'consumer' ? 'consumer-home' : 'vendor-home');
  };

  const handleSignup = () => {
    login();
    navigateTo(userType === 'consumer' ? 'consumer-home' : 'vendor-home');
  };

  const handleBack = () => {
    goBack();
  };

  return (
    <OriginalLoginScreen 
      onLogin={handleLogin}
      onSignup={handleSignup}
      onBack={handleBack}
      userType={userType}
    />
  );
};

export default LoginScreen;
