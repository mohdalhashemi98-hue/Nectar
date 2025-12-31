import { useEffect, useState, useCallback, useRef } from 'react';
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

  const initRef = useRef(false);
  const { setIsAuthenticated, setUserType, logout: storeLogout } = useAppStore();

  useEffect(() => {
    // Prevent double initialization in StrictMode
    if (initRef.current) return;
    initRef.current = true;

    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        // Handle token refresh errors - clear corrupted session
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.warn('Token refresh failed, clearing session');
          supabase.auth.signOut();
          return;
        }

        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
        });

        // Update Zustand store synchronously
        setIsAuthenticated(!!session?.user);
      }
    );

    // THEN check for existing session with error handling
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (!mounted) return;

        // If there's a session error (like invalid refresh token), clear it
        if (error) {
          console.warn('Session error, clearing:', error.message);
          supabase.auth.signOut();
          setAuthState({ user: null, session: null, loading: false });
          setIsAuthenticated(false);
          return;
        }

        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
        });
        setIsAuthenticated(!!session?.user);
      })
      .catch((err) => {
        if (!mounted) return;
        console.warn('Failed to get session:', err);
        setAuthState({ user: null, session: null, loading: false });
        setIsAuthenticated(false);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setIsAuthenticated]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
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

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata,
        },
      });

      if (error) {
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
