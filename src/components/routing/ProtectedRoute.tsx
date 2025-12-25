import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/stores/app-store';
import { supabase } from '@/integrations/supabase/client';
import { UserType } from '@/types/stack';
import LoadingSpinner from '@/components/stack/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: UserType[];
}

/**
 * ProtectedRoute - Auth guard component
 * 
 * Verifies actual Supabase session before rendering children.
 * Redirects to /login with saved destination if not authenticated.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedUserTypes 
}) => {
  const location = useLocation();
  const { isAuthenticated, userType, setIsAuthenticated } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);

  useEffect(() => {
    // Verify session with Supabase
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const isValid = !!session?.user;
        setHasValidSession(isValid);
        
        // Sync Zustand store with actual session state
        if (isValid !== isAuthenticated) {
          setIsAuthenticated(isValid);
        }
      } catch (error) {
        setHasValidSession(false);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const isValid = !!session?.user;
        setHasValidSession(isValid);
        setIsAuthenticated(isValid);
      }
    );

    return () => subscription.unsubscribe();
  }, [isAuthenticated, setIsAuthenticated]);

  // Show loading while checking session
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  // Not authenticated - redirect to login with intended destination
  if (!hasValidSession) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check if user type is allowed (if specified)
  if (allowedUserTypes && allowedUserTypes.length > 0) {
    if (!userType || !allowedUserTypes.includes(userType)) {
      // Redirect to appropriate home based on user type
      const redirectPath = userType === 'vendor' ? '/vendor' : 
                          userType === 'consumer' ? '/consumer' : '/';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
