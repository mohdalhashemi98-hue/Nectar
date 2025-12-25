import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/stores/app-store';
import { UserType } from '@/types/stack';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: UserType[];
}

/**
 * ProtectedRoute - Auth guard component
 * 
 * Checks authentication status and user type before rendering children.
 * Redirects to /login with saved destination if not authenticated.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedUserTypes 
}) => {
  const location = useLocation();
  const { isAuthenticated, userType } = useAppStore();

  // Not authenticated - redirect to login with intended destination
  if (!isAuthenticated) {
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
