import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, User, Mail, ChevronLeft, AlertCircle, CheckCircle2, ArrowLeft, Briefcase, Home } from 'lucide-react';
import { UserType } from '@/types/stack';
import StackLogo from '@/components/StackLogo';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

// Theme configurations based on user type
const getThemeConfig = (userType: UserType) => {
  if (userType === 'vendor') {
    return {
      bgClass: 'bg-[#0f172a]',
      gradientClass: 'bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#0f172a]',
      accentColor: 'bg-blue-500',
      textPrimary: 'text-white',
      textSecondary: 'text-blue-200/80',
      backButtonBg: 'bg-blue-500/20 hover:bg-blue-500/30',
      backButtonText: 'text-white',
      icon: Briefcase,
      title: 'Pro Login',
      subtitle: 'Access your professional dashboard',
      signupTitle: 'Join as a Pro',
      signupSubtitle: 'Start earning with Stack today',
    };
  }
  return {
    bgClass: 'bg-gradient-to-br from-sky-500 via-blue-500 to-blue-600',
    gradientClass: 'bg-gradient-to-br from-sky-500 via-blue-500 to-blue-600',
    accentColor: 'bg-white',
    textPrimary: 'text-white',
    textSecondary: 'text-white/80',
    backButtonBg: 'bg-white/20 hover:bg-white/30',
    backButtonText: 'text-white',
    icon: Home,
    title: 'Welcome Back',
    subtitle: 'Find trusted professionals',
    signupTitle: 'Create Account',
    signupSubtitle: 'Join Stack and get things done',
  };
};

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onSignupSuccess: () => void;
  onBack?: () => void;
  userType?: UserType;
}

type AuthScreen = 'login' | 'signup' | 'forgot-password' | 'reset-sent';

// Validation schemas
const emailSchema = z.string().trim().email('Please enter a valid email address').max(255, 'Email must be less than 255 characters');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const nameSchema = z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters');

const LoginScreen = ({ onLoginSuccess, onSignupSuccess, onBack, userType }: LoginScreenProps) => {
  const theme = getThemeConfig(userType || null);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [authData, setAuthData] = useState({ email: '', password: '', name: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState('');

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
        email: authData.email.trim(),
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
        email: authData.email.trim(),
        password: authData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: authData.name.trim(),
            phone: authData.phone.trim(),
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

  const handleForgotPassword = async () => {
    setError(null);
    
    const emailResult = emailSchema.safeParse(resetEmail);
    if (!emailResult.success) {
      setError(emailResult.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        resetEmail.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        setError(resetError.message);
        setIsLoading(false);
        return;
      }

      setAuthScreen('reset-sent');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  // Forgot Password Screen
  if (authScreen === 'forgot-password') {
    return (
      <div className={`flex flex-col h-screen ${theme.gradientClass} relative overflow-hidden`}>
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        
        <div className="flex-1 flex flex-col justify-center px-4 relative z-10">
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => { setAuthScreen('login'); clearError(); setResetEmail(''); }} 
            className={`absolute top-6 left-6 p-2 ${theme.backButtonBg} rounded-xl transition-colors`}
          >
            <ChevronLeft className={`w-6 h-6 ${theme.backButtonText}`} />
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className={`font-display text-3xl font-bold ${theme.textPrimary}`}>Reset Password</h1>
            <p className={theme.textSecondary + " mt-1"}>
              Enter your email to receive a reset link
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
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={resetEmail}
                    onChange={(e) => { setResetEmail(e.target.value); clearError(); }}
                    className="input-modern pl-12"
                  />
                </div>
              </div>

              <button
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <button 
                onClick={() => { setAuthScreen('login'); clearError(); setResetEmail(''); }} 
                className="text-muted-foreground font-medium hover:text-primary transition-colors flex items-center justify-center gap-2 w-full"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Reset Link Sent Confirmation Screen
  if (authScreen === 'reset-sent') {
    return (
      <div className={`flex flex-col h-screen ${theme.gradientClass} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        
        <div className="flex-1 flex flex-col justify-center px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className={`font-display text-3xl font-bold ${theme.textPrimary}`}>Check Your Email</h1>
            <p className={`${theme.textSecondary} mt-2 max-w-xs mx-auto`}>
              We've sent a password reset link to <strong className="text-white">{resetEmail}</strong>
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-3xl p-6"
            style={{ boxShadow: 'var(--shadow-xl)' }}
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              <button
                onClick={() => { setAuthScreen('forgot-password'); clearError(); }}
                className="btn-primary w-full"
              >
                Try Again
              </button>

              <button 
                onClick={() => { setAuthScreen('login'); clearError(); setResetEmail(''); }} 
                className="w-full py-3 text-muted-foreground font-medium hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (authScreen === 'signup') {
    return (
      <div className={`flex flex-col h-screen ${theme.gradientClass} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        
        <div className="flex-1 flex flex-col justify-center px-4 relative z-10">
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => { setAuthScreen('login'); clearError(); }} 
            className={`absolute top-6 left-6 p-2 ${theme.backButtonBg} rounded-xl transition-colors`}
          >
            <ChevronLeft className={`w-6 h-6 ${theme.backButtonText}`} />
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <theme.icon className="w-8 h-8 text-white" />
            </div>
            <h1 className={`font-display text-3xl font-bold ${theme.textPrimary}`}>{theme.signupTitle}</h1>
            <p className={`${theme.textSecondary} mt-1`}>{theme.signupSubtitle}</p>
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
    <div className={`flex flex-col h-screen ${theme.gradientClass} relative overflow-hidden`}>
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
      
      <div className="flex-1 flex flex-col justify-center px-4 relative z-10">
        {onBack && (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onBack} 
            className={`absolute top-6 left-6 p-2 ${theme.backButtonBg} rounded-xl transition-colors`}
          >
            <ChevronLeft className={`w-6 h-6 ${theme.backButtonText}`} />
          </motion.button>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <theme.icon className="w-10 h-10 text-white" />
          </div>
          <h1 className={`font-display text-3xl font-bold ${theme.textPrimary}`}>{theme.title}</h1>
          <p className={`${theme.textSecondary} mt-1`}>{theme.subtitle}</p>
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

            <button 
              onClick={() => { setAuthScreen('forgot-password'); clearError(); }}
              className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors"
            >
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
