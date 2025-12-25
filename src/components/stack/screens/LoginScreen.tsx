import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, User, Mail, ChevronLeft, AlertCircle } from 'lucide-react';
import { UserType } from '@/types/stack';
import StackLogo from '@/components/StackLogo';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onSignupSuccess: () => void;
  onBack?: () => void;
  userType?: UserType;
}

type AuthScreen = 'login' | 'signup';

// Validation schemas
const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const nameSchema = z.string().min(2, 'Name must be at least 2 characters');

const LoginScreen = ({ onLoginSuccess, onSignupSuccess, onBack, userType }: LoginScreenProps) => {
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [authData, setAuthData] = useState({ email: '', password: '', name: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateLogin = (): string | null => {
    const emailResult = emailSchema.safeParse(authData.email);
    if (!emailResult.success) {
      return emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(authData.password);
    if (!passwordResult.success) {
      return passwordResult.error.errors[0].message;
    }
    
    return null;
  };

  const validateSignup = (): string | null => {
    const nameResult = nameSchema.safeParse(authData.name);
    if (!nameResult.success) {
      return nameResult.error.errors[0].message;
    }
    
    const emailResult = emailSchema.safeParse(authData.email);
    if (!emailResult.success) {
      return emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(authData.password);
    if (!passwordResult.success) {
      return passwordResult.error.errors[0].message;
    }
    
    return null;
  };

  const handleLogin = async () => {
    setError(null);
    
    const validationError = validateLogin();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: authData.email,
        password: authData.password,
      });

      if (authError) {
        // User-friendly error messages
        if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please check your email to confirm your account.');
        } else {
          setError(authError.message);
        }
        setIsLoading(false);
        return;
      }

      onLoginSuccess();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setError(null);
    
    const validationError = validateSignup();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error: authError } = await supabase.auth.signUp({
        email: authData.email,
        password: authData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: authData.name,
            phone: authData.phone,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('This email is already registered. Please log in instead.');
        } else {
          setError(authError.message);
        }
        setIsLoading(false);
        return;
      }

      onSignupSuccess();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  if (authScreen === 'signup') {
    return (
      <div className="flex flex-col h-screen bg-gradient-golden">
        <div className="flex-1 flex flex-col justify-center px-4">
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => { setAuthScreen('login'); clearError(); }} 
            className="absolute top-6 left-6 p-2 bg-primary-foreground/20 rounded-xl hover:bg-primary-foreground/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-primary-foreground" />
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="font-display text-3xl font-bold text-primary-foreground">Create Account</h1>
            <p className="text-primary-foreground/70 mt-1">
              {userType === 'vendor' ? 'Join as a Professional' : 'Join Stack today'}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-3xl p-6"
            style={{ boxShadow: 'var(--shadow-xl)' }}
          >
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={authData.name}
                    onChange={(e) => { setAuthData({ ...authData, name: e.target.value }); clearError(); }}
                    className="input-modern pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={authData.email}
                    onChange={(e) => { setAuthData({ ...authData, email: e.target.value }); clearError(); }}
                    className="input-modern pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone (optional)</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="+971 50 123 4567"
                    value={authData.phone}
                    onChange={(e) => setAuthData({ ...authData, phone: e.target.value })}
                    className="input-modern pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create password (min 6 characters)"
                    value={authData.password}
                    onChange={(e) => { setAuthData({ ...authData, password: e.target.value }); clearError(); }}
                    className="input-modern pl-12 pr-12"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSignup}
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <span className="text-muted-foreground">Already have an account? </span>
              <button onClick={() => { setAuthScreen('login'); clearError(); }} className="text-primary font-semibold hover:underline">Log In</button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-golden">
      <div className="flex-1 flex flex-col justify-center px-4">
        {onBack && (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onBack} 
            className="absolute top-6 left-6 p-2 bg-primary-foreground/20 rounded-xl hover:bg-primary-foreground/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-primary-foreground" />
          </motion.button>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <StackLogo size={80} className="mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-primary-foreground">Stack</h1>
          <p className="text-primary-foreground/70 mt-1">
            {userType === 'vendor' ? 'Welcome, Professional!' : 'Welcome back!'}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-6"
          style={{ boxShadow: 'var(--shadow-xl)' }}
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={authData.email}
                  onChange={(e) => { setAuthData({ ...authData, email: e.target.value }); clearError(); }}
                  className="input-modern pl-12"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={authData.password}
                  onChange={(e) => { setAuthData({ ...authData, password: e.target.value }); clearError(); }}
                  className="input-modern pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground" />}
                </button>
              </div>
            </div>

            <button className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors">
              Forgot password?
            </button>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button
              onClick={() => { setAuthScreen('signup'); clearError(); }}
              className="text-primary font-semibold hover:underline"
            >
              Sign Up
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginScreen;
