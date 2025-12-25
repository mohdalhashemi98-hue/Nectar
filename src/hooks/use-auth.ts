import { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAppStore } from '@/stores/app-store';

interface AuthError {
  message: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });
  
  const { setIsAuthenticated, setUserType, logout: storeLogout } = useAppStore();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
        });
        
        // Update Zustand store synchronously
        setIsAuthenticated(!!session?.user);
        
        // Defer profile fetching to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            // Could fetch user profile/type here if needed
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
      });
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, [setIsAuthenticated]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: { message: error.message } };
      }

      return { error: null };
    } catch (err) {
      return { error: { message: 'An unexpected error occurred' } };
    }
  }, []);

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    metadata?: { name?: string; phone?: string }
  ): Promise<{ error: AuthError | null }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata,
        },
      });

      if (error) {
        // Handle common signup errors with user-friendly messages
        if (error.message.includes('already registered')) {
          return { error: { message: 'This email is already registered. Please log in instead.' } };
        }
        return { error: { message: error.message } };
      }

      return { error: null };
    } catch (err) {
      return { error: { message: 'An unexpected error occurred' } };
    }
  }, []);

  const signOut = useCallback(async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { error: { message: error.message } };
      }

      // Clear Zustand store
      storeLogout();
      
      return { error: null };
    } catch (err) {
      return { error: { message: 'An unexpected error occurred' } };
    }
  }, [storeLogout]);

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    isAuthenticated: !!authState.session,
    signIn,
    signUp,
    signOut,
  };
};

export default useAuth;
