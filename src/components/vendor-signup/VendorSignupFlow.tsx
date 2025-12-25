import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVendorSignupStore } from '@/stores/vendor-signup-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useAppStore } from '@/stores/app-store';
import HookStep from './steps/HookStep';
import AccountStep from './steps/AccountStep';
import LocationStep from './steps/LocationStep';
import VerificationStep from './steps/VerificationStep';
import SuccessStep from './steps/SuccessStep';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const VendorSignupFlow: React.FC = () => {
  const { navigateTo } = useAppNavigation();
  const { setUserType, setIsAuthenticated } = useAppStore();
  const { 
    currentStep, 
    data, 
    userId,
    setCurrentStep, 
    updateData, 
    setUserId,
    setCompleted,
    resetSignup 
  } = useVendorSignupStore();
  
  const [direction, setDirection] = React.useState(1);

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const handleTradeToggle = (trade: string) => {
    const currentTrades = data.primaryTrades;
    if (currentTrades.includes(trade)) {
      updateData({ primaryTrades: currentTrades.filter(t => t !== trade) });
    } else {
      updateData({ primaryTrades: [...currentTrades, trade] });
    }
  };

  const handleAccountCreated = async (newUserId: string) => {
    setUserId(newUserId);
    setIsAuthenticated(true);
    setUserType('vendor');
    
    // Create initial vendor profile
    try {
      await supabase.from('vendor_profiles').upsert({
        user_id: newUserId,
        business_name: data.name || 'My Business',
        service_category: data.primaryTrades.join(', '),
        onboarding_step: 3,
        onboarding_completed: false,
      });
    } catch (error) {
      console.error('Error creating vendor profile:', error);
    }
    
    goToStep(3);
  };

  const handleLocationComplete = async () => {
    // Update vendor profile with location
    if (userId) {
      try {
        await supabase.from('vendor_profiles').update({
          onboarding_step: 4,
        }).eq('user_id', userId);
      } catch (error) {
        console.error('Error updating vendor profile:', error);
      }
    }
    goToStep(4);
  };

  const handleVerificationComplete = async () => {
    // Mark onboarding as complete
    if (userId) {
      try {
        await supabase.from('vendor_profiles').update({
          onboarding_step: 5,
          onboarding_completed: true,
        }).eq('user_id', userId);
        
        // Also create vendor stats entry
        await supabase.from('vendor_stats').upsert({
          user_id: userId,
          rating: 0,
          reviews: 0,
          total_jobs: 0,
          total_earnings: 0,
          this_month_jobs: 0,
          this_month_earnings: 0,
          completion_rate: 100,
          response_time: 'New',
        });
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    }
    
    setCompleted(true);
    goToStep(5);
  };

  const handleGoToDashboard = () => {
    resetSignup();
    navigateTo('vendor-home');
  };

  const handleCompleteProfile = () => {
    resetSignup();
    navigateTo('vendor-onboarding');
  };

  // Progress bar
  const progress = currentStep === 5 ? 100 : ((currentStep - 1) / 4) * 100;

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Progress Bar */}
      {currentStep < 5 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted"
        >
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          {currentStep === 1 && (
            <HookStep
              selectedTrades={data.primaryTrades}
              onTradeToggle={handleTradeToggle}
              onNext={() => goToStep(2)}
            />
          )}
          
          {currentStep === 2 && (
            <AccountStep
              data={{
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
              }}
              onUpdate={(updates) => updateData(updates)}
              onNext={handleAccountCreated}
              onBack={() => goToStep(1)}
            />
          )}
          
          {currentStep === 3 && (
            <LocationStep
              location={data.location}
              serviceRadius={data.serviceRadius}
              onUpdate={(updates) => updateData(updates)}
              onNext={handleLocationComplete}
              onBack={() => goToStep(2)}
            />
          )}
          
          {currentStep === 4 && (
            <VerificationStep
              businessLicenseUrl={data.businessLicenseUrl}
              idPhotoUrl={data.idPhotoUrl}
              onUpdate={(updates) => updateData(updates)}
              onNext={handleVerificationComplete}
              onBack={() => goToStep(3)}
              userId={userId}
            />
          )}
          
          {currentStep === 5 && (
            <SuccessStep
              primaryTrades={data.primaryTrades}
              onGoToDashboard={handleGoToDashboard}
              onCompleteProfile={handleCompleteProfile}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VendorSignupFlow;
