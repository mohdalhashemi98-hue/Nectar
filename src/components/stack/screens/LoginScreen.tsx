import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, User, Mail, ChevronLeft, AlertCircle, CheckCircle2, ArrowLeft, Phone } from 'lucide-react';
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

type AuthScreen = 'login' | 'signup' | 'forgot-password' | 'reset-sent';

const emailSchema = z.string().trim().email('Please enter a valid email address').max(255);
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
const nameSchema = z.string().trim().min(2, 'Name must be at least 2 characters').max(100);

const LoginScreen = ({ onLoginSuccess, onSignupSuccess, onBack, userType }: LoginScreenProps) => {
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [authData, setAuthData] = useState({ email: '', password: '', name: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState('');

  const clearError = () => setError(null);

  const validateLogin = (): string | null => {
    const e = emailSchema.safeParse(authData.email);
    if (!e.success) return e.error.errors[0].message;
    const p = passwordSchema.safeParse(authData.password);
    if (!p.success) return p.error.errors[0].message;
    return null;
  };

  const validateSignup = (): string | null => {
    const n = nameSchema.safeParse(authData.name);
    if (!n.success) return n.error.errors[0].message;
    const e = emailSchema.safeParse(authData.email);
    if (!e.success) return e.error.errors[0].message;
    const p = passwordSchema.safeParse(authData.password);
    if (!p.success) return p.error.errors[0].message;
    return null;
  };

  const handleLogin = async () => {
    setError(null);
    const v = validateLogin();
    if (v) { setError(v); return; }
    setIsLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: authData.email.trim(), password: authData.password,
      });
      if (authError) {
        if (authError.message.includes('Invalid login credentials')) setError('Invalid email or password.');
        else if (authError.message.includes('Email not confirmed')) setError('Please confirm your email first.');
        else setError(authError.message);
        return;
      }
      onLoginSuccess();
    } catch { setError('An unexpected error occurred.'); }
    finally { setIsLoading(false); }
  };

  const handleSignup = async () => {
    setError(null);
    const v = validateSignup();
    if (v) { setError(v); return; }
    setIsLoading(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: authData.email.trim(), password: authData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { name: authData.name.trim(), phone: authData.phone.trim() },
        },
      });
      if (authError) {
        if (authError.message.includes('already registered')) setError('Email already registered. Please log in.');
        else setError(authError.message);
        return;
      }
      onSignupSuccess();
    } catch { setError('An unexpected error occurred.'); }
    finally { setIsLoading(false); }
  };

  const handleForgotPassword = async () => {
    setError(null);
    const e = emailSchema.safeParse(resetEmail);
    if (!e.success) { setError(e.error.errors[0].message); return; }
    setIsLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) { setError(resetError.message); return; }
      setAuthScreen('reset-sent');
    } catch { setError('An unexpected error occurred.'); }
    finally { setIsLoading(false); }
  };

  const ErrorBanner = () => error ? (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
    >
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{error}</span>
    </motion.div>
  ) : null;

  // Forgot Password
  if (authScreen === 'forgot-password') {
    return (
      <div className="dark flex flex-col h-full bg-background">
        <div className="flex-1 flex flex-col justify-center px-6">
          <button
            onClick={() => { setAuthScreen('login'); clearError(); setResetEmail(''); }}
            className="absolute top-6 left-6 p-2 bg-foreground/10 rounded-xl"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground">Reset Password</h1>
            <p className="text-muted-foreground text-sm mt-1">Enter your email to receive a reset link</p>
          </div>
          <div className="bg-card rounded-xl p-6">
            <ErrorBanner />
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input type="email" placeholder="your@email.com" value={resetEmail}
                  onChange={(e) => { setResetEmail(e.target.value); clearError(); }}
                  className="input-modern" />
              </div>
              <button onClick={handleForgotPassword} disabled={isLoading} className="btn-primary w-full disabled:opacity-50">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
            <div className="mt-6 text-center">
              <button onClick={() => { setAuthScreen('login'); clearError(); }}
                className="text-muted-foreground text-sm hover:text-primary flex items-center justify-center gap-2 w-full">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reset Sent
  if (authScreen === 'reset-sent') {
    return (
      <div className="dark flex flex-col h-full bg-background">
        <div className="flex-1 flex flex-col justify-center px-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Check Your Email</h1>
            <p className="text-muted-foreground text-sm mt-2">We sent a reset link to <strong className="text-foreground">{resetEmail}</strong></p>
          </div>
          <div className="bg-card rounded-xl p-6 space-y-4">
            <p className="text-sm text-muted-foreground text-center">Didn't receive it? Check spam or try again.</p>
            <button onClick={() => { setAuthScreen('forgot-password'); clearError(); }} className="btn-primary w-full">Try Again</button>
            <button onClick={() => { setAuthScreen('login'); clearError(); setResetEmail(''); }}
              className="w-full py-3 text-muted-foreground text-sm hover:text-primary flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Signup
  if (authScreen === 'signup') {
    return (
      <div className="dark flex flex-col h-full bg-background overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center px-6 py-8">
          <button onClick={() => { setAuthScreen('login'); clearError(); }}
            className="absolute top-6 left-6 p-2 bg-foreground/10 rounded-xl z-10">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground text-sm mt-1">Join Stack and get things done</p>
          </div>
          <div className="bg-card rounded-xl p-6">
            <ErrorBanner />
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                <input type="text" placeholder="Your name" value={authData.name}
                  onChange={(e) => { setAuthData({ ...authData, name: e.target.value }); clearError(); }}
                  className="input-modern" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input type="email" placeholder="your@email.com" value={authData.email}
                  onChange={(e) => { setAuthData({ ...authData, email: e.target.value }); clearError(); }}
                  className="input-modern" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Phone (optional)</label>
                <input type="tel" placeholder="+971 50 123 4567" value={authData.phone}
                  onChange={(e) => setAuthData({ ...authData, phone: e.target.value })}
                  className="input-modern" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters"
                    value={authData.password}
                    onChange={(e) => { setAuthData({ ...authData, password: e.target.value }); clearError(); }}
                    className="input-modern pr-12" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                    {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground" />}
                  </button>
                </div>
              </div>
              <button onClick={handleSignup} disabled={isLoading} className="btn-primary w-full disabled:opacity-50">
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <button onClick={() => { setAuthScreen('login'); clearError(); }} className="text-primary font-semibold">Log In</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login (default)
  return (
    <div className="dark flex flex-col h-full bg-background">
      <div className="flex-1 flex flex-col justify-center px-6">
        {onBack && (
          <button onClick={onBack} className="absolute top-6 left-6 p-2 bg-foreground/10 rounded-xl">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <StackLogo size={56} />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
        </div>
        <div className="bg-card rounded-xl p-6">
          <ErrorBanner />
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input type="email" placeholder="your@email.com" value={authData.email}
                onChange={(e) => { setAuthData({ ...authData, email: e.target.value }); clearError(); }}
                className="input-modern" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter password"
                  value={authData.password}
                  onChange={(e) => { setAuthData({ ...authData, password: e.target.value }); clearError(); }}
                  className="input-modern pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground" />}
                </button>
              </div>
            </div>
            <button onClick={() => { setAuthScreen('forgot-password'); clearError(); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Forgot password?
            </button>
            <button onClick={handleLogin} disabled={isLoading} className="btn-primary w-full disabled:opacity-50">
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button onClick={() => { setAuthScreen('signup'); clearError(); }} className="text-primary font-semibold">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
