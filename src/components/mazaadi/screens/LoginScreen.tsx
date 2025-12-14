import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, User, Mail, ChevronLeft, Smartphone } from 'lucide-react';
import { UserType } from '@/types/mazaadi';
import nectarLogo from '@/assets/nectar-logo.png';

interface LoginScreenProps {
  onLogin: () => void;
  onSignup: () => void;
  onBack?: () => void;
  userType?: UserType;
}

type AuthScreen = 'login' | 'signup' | 'otp';

const LoginScreen = ({ onLogin, onSignup, onBack, userType }: LoginScreenProps) => {
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [authData, setAuthData] = useState({ phone: '', password: '', name: '', email: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleSignup = () => {
    setAuthScreen('otp');
  };

  const handleVerifyOTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignup();
    }, 1500);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (authScreen === 'otp') {
    return (
      <div className="flex flex-col h-screen bg-gradient-golden">
        <div className="flex-1 flex flex-col justify-center px-4">
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setAuthScreen('signup')} 
            className="absolute top-6 left-6 p-2 bg-primary-foreground/20 rounded-xl hover:bg-primary-foreground/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-primary-foreground" />
          </motion.button>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-foreground/20 rounded-3xl mb-4">
              <Smartphone className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-primary-foreground">Verify Phone</h1>
            <p className="text-primary-foreground/70 mt-2">
              Enter the 6-digit code sent to<br />{authData.phone || '+971 50 XXX XXXX'}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-3xl p-6"
            style={{ boxShadow: 'var(--shadow-xl)' }}
          >
            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  className="w-12 h-14 text-center text-2xl font-bold bg-secondary border-2 border-transparent rounded-xl focus:border-primary focus:outline-none transition-colors"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={isLoading}
              className="btn-primary w-full mb-4 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>

            <div className="text-center">
              <span className="text-muted-foreground">Didn't receive code? </span>
              <button className="text-primary font-semibold hover:underline">Resend</button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (authScreen === 'signup') {
    return (
      <div className="flex flex-col h-screen bg-gradient-golden">
        <div className="flex-1 flex flex-col justify-center px-4">
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setAuthScreen('login')} 
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
              {userType === 'vendor' ? 'Join as a Professional' : 'Join Nectar today'}
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
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={authData.name}
                    onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                    className="input-modern pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
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
                <label className="block text-sm font-semibold text-foreground mb-2">Email (optional)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={authData.email}
                    onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
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
                    placeholder="Create password"
                    value={authData.password}
                    onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                    className="input-modern pl-12 pr-12"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSignup}
                className="btn-primary w-full"
              >
                Continue
              </button>
            </div>

            <div className="mt-6 text-center">
              <span className="text-muted-foreground">Already have an account? </span>
              <button onClick={() => setAuthScreen('login')} className="text-primary font-semibold hover:underline">Log In</button>
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
          <img src={nectarLogo} alt="Nectar" className="w-20 h-20 mx-auto mb-4 object-contain" />
          <h1 className="font-display text-3xl font-bold text-primary-foreground">Nectar</h1>
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
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
                  placeholder="Enter password"
                  value={authData.password}
                  onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                  className="input-modern pl-12 pr-12"
                />
                <button
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
              onClick={() => setAuthScreen('signup')}
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