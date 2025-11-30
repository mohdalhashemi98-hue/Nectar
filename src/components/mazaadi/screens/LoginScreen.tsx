import { useState } from 'react';
import { Phone, Lock, Eye, EyeOff, User, Mail, ChevronLeft, Smartphone } from 'lucide-react';
import { UserType } from '@/types/mazaadi';

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

  if (authScreen === 'otp') {
    return (
      <div className="flex flex-col h-screen bg-gradient-hero">
        <div className="flex-1 flex flex-col justify-center px-6">
          <button 
            onClick={() => setAuthScreen('signup')} 
            className="absolute top-6 left-6 p-2 bg-primary-foreground/20 rounded-xl hover:bg-primary-foreground/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-primary-foreground" />
          </button>

          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 glass-dark rounded-3xl mb-4 animate-bounce-subtle">
              <Smartphone className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-primary-foreground">Verify Phone</h1>
            <p className="text-primary-foreground/70 mt-2">
              Enter the 6-digit code sent to<br />{authData.phone || '+971 50 XXX XXXX'}
            </p>
          </div>

          <div className="bg-card rounded-3xl p-6 shadow-xl animate-slide-up">
            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  className="w-12 h-14 text-center text-2xl font-bold bg-muted border-2 border-border rounded-xl focus:border-primary focus:outline-none transition-colors"
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
              <button className="text-primary font-bold hover:underline">Resend</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (authScreen === 'signup') {
    return (
      <div className="flex flex-col h-screen bg-gradient-hero">
        <div className="flex-1 flex flex-col justify-center px-6">
          {/* Back Button */}
          <button 
            onClick={() => setAuthScreen('login')} 
            className="absolute top-6 left-6 p-2 bg-primary-foreground/20 rounded-xl hover:bg-primary-foreground/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-primary-foreground" />
          </button>
          
          <div className="text-center mb-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-primary-foreground">Create Account</h1>
            <p className="text-primary-foreground/70 mt-1">
              {userType === 'vendor' ? 'Join as a Professional' : 'Join Mazaadi today'}
            </p>
          </div>

          <div className="bg-card rounded-3xl p-6 shadow-xl animate-slide-up">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Full Name</label>
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
                <label className="block text-sm font-bold text-foreground mb-2">Phone Number</label>
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
                <label className="block text-sm font-bold text-foreground mb-2">Email (optional)</label>
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
                <label className="block text-sm font-bold text-foreground mb-2">Password</label>
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
              <button onClick={() => setAuthScreen('login')} className="text-primary font-bold hover:underline">Log In</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-hero">
      <div className="flex-1 flex flex-col justify-center px-6">
        {/* Back Button */}
        {onBack && (
          <button 
            onClick={onBack} 
            className="absolute top-6 left-6 p-2 bg-primary-foreground/20 rounded-xl hover:bg-primary-foreground/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-primary-foreground" />
          </button>
        )}
        
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 glass-dark rounded-3xl mb-4 animate-bounce-subtle">
            <span className="text-4xl">🤝</span>
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground">Mazaadi</h1>
          <p className="text-primary-foreground/70 mt-1">
            {userType === 'vendor' ? 'Welcome, Professional!' : 'Welcome back!'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-3xl p-6 shadow-xl animate-slide-up">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Phone Number</label>
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
              <label className="block text-sm font-bold text-foreground mb-2">Password</label>
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

            <button className="text-sm text-primary font-semibold hover:underline">
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
              className="text-primary font-bold hover:underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
