import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, ChevronRight, AlertCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

interface AccountStepProps {
  data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  };
  onUpdate: (updates: Partial<{ name: string; email: string; phone: string; password: string }>) => void;
  onNext: (userId: string) => void;
  onBack: () => void;
}

const accountSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[0-9\s-]{10,}$/, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const AccountStep: React.FC<AccountStepProps> = ({ data, onUpdate, onNext, onBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    try {
      const fieldSchema = accountSchema.shape[field as keyof typeof accountSchema.shape];
      fieldSchema.parse(value);
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    } catch (err) {
      if (err instanceof z.ZodError) {
        setFieldErrors(prev => ({ ...prev, [field]: err.errors[0].message }));
      }
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/vendor/signup?step=3`,
        },
      });

      if (authError) {
        setError(authError.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    
    // Validate all fields
    const result = accountSchema.safeParse(data);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/vendor/signup?step=3`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: data.name,
            phone: data.phone,
            user_type: 'vendor',
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

      if (authData.user) {
        onNext(authData.user.id);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center p-4 border-b border-border/50"
      >
        <button 
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center font-display text-xl font-bold pr-10">Create Account</h1>
      </motion.div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Social Auth */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 mb-6"
        >
          <Button
            variant="outline"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full h-14 rounded-2xl text-base font-medium gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </Button>
          
          <Button
            variant="outline"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl text-base font-medium gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Sign up with Apple
          </Button>
        </motion.div>

        {/* Divider */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">or continue with email</span>
          <div className="flex-1 h-px bg-border" />
        </motion.div>

        {/* Error Message */}
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

        {/* Form Fields */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter your name"
                value={data.name}
                onChange={(e) => {
                  onUpdate({ name: e.target.value });
                  validateField('name', e.target.value);
                }}
                className={`pl-12 h-14 rounded-2xl ${fieldErrors.name ? 'border-destructive' : ''}`}
              />
            </div>
            {fieldErrors.name && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="your@email.com"
                value={data.email}
                onChange={(e) => {
                  onUpdate({ email: e.target.value });
                  validateField('email', e.target.value);
                }}
                className={`pl-12 h-14 rounded-2xl ${fieldErrors.email ? 'border-destructive' : ''}`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="+971 50 123 4567"
                value={data.phone}
                onChange={(e) => {
                  onUpdate({ phone: e.target.value });
                  validateField('phone', e.target.value);
                }}
                className={`pl-12 h-14 rounded-2xl ${fieldErrors.phone ? 'border-destructive' : ''}`}
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create password (min 6 characters)"
                value={data.password}
                onChange={(e) => {
                  onUpdate({ password: e.target.value });
                  validateField('password', e.target.value);
                }}
                className={`pl-12 pr-12 h-14 rounded-2xl ${fieldErrors.password ? 'border-destructive' : ''}`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.password}</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Submit Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 pb-8 border-t border-border/50"
      >
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full h-14 rounded-2xl text-lg font-semibold"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};

export default AccountStep;
