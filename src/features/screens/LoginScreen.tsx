import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import OriginalLoginScreen from '@/components/stack/screens/LoginScreen';
import { supabase } from '@/integrations/supabase/client';

const LoginScreen: React.FC = () => {
  const { login, userType, isAuthenticated } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();
  const hasRedirected = useRef(false);

  // Check if already authenticated and redirect (only once)
  useEffect(() => {
    if (isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      navigateTo(userType === 'consumer' ? 'consumer-home' : userType === 'vendor' ? 'vendor-home' : 'welcome');
    }
  }, [isAuthenticated, userType, navigateTo]);

  // Listen for auth state changes - simplified
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user && !hasRedirected.current) {
          hasRedirected.current = true;
          login();
          // Use setTimeout to avoid state update during render
          setTimeout(() => {
            navigateTo(userType === 'consumer' ? 'consumer-home' : userType === 'vendor' ? 'vendor-home' : 'welcome');
          }, 0);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [login, navigateTo, userType]);

  const handleLoginSuccess = () => {
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      login();
      navigateTo(userType === 'consumer' ? 'consumer-home' : userType === 'vendor' ? 'vendor-home' : 'welcome');
    }
  };

  const handleSignupSuccess = () => {
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      login();
      navigateTo(userType === 'consumer' ? 'consumer-home' : userType === 'vendor' ? 'vendor-home' : 'welcome');
    }
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
