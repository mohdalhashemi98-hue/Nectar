import React, { useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import OriginalLoginScreen from '@/components/stack/screens/LoginScreen';
import { supabase } from '@/integrations/supabase/client';

const LoginScreen: React.FC = () => {
  const { login, userType, isAuthenticated } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();

  // Check if already authenticated and redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigateTo(userType === 'consumer' ? 'consumer-home' : userType === 'vendor' ? 'vendor-home' : 'welcome');
    }
  }, [isAuthenticated, userType, navigateTo]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          login();
          navigateTo(userType === 'consumer' ? 'consumer-home' : userType === 'vendor' ? 'vendor-home' : 'welcome');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [login, navigateTo, userType]);

  const handleLoginSuccess = () => {
    login();
    navigateTo(userType === 'consumer' ? 'consumer-home' : userType === 'vendor' ? 'vendor-home' : 'welcome');
  };

  const handleSignupSuccess = () => {
    login();
    navigateTo(userType === 'consumer' ? 'consumer-home' : userType === 'vendor' ? 'vendor-home' : 'welcome');
  };

  const handleBack = () => {
    goBack();
  };

  return (
    <OriginalLoginScreen 
      onLoginSuccess={handleLoginSuccess}
      onSignupSuccess={handleSignupSuccess}
      onBack={handleBack}
      userType={userType}
    />
  );
};

export default LoginScreen;
