import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useVendorOnboardingStore } from '@/stores/vendor-onboarding-store';
import OnboardingProgress from './OnboardingProgress';
import CoreIdentityStep from './steps/CoreIdentityStep';
import SkillsStep from './steps/SkillsStep';
import CertificationsStep from './steps/CertificationsStep';
import PortfolioStep from './steps/PortfolioStep';
import StackPattern from '../stack/StackPattern';

const STEP_LABELS = ['Identity', 'Skills', 'Credentials', 'Portfolio'];
const TOTAL_STEPS = 4;

interface VendorOnboardingScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const VendorOnboardingScreen = ({ onComplete, onBack }: VendorOnboardingScreenProps) => {
  const { currentStep, data, nextStep, prevStep, setStep, setComplete } = useVendorOnboardingStore();
  const [stepValid, setStepValid] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [isSaving, setIsSaving] = useState(false);

  const handleValidChange = useCallback((isValid: boolean) => {
    setStepValid(isValid);
  }, []);

  const handleNext = () => {
    if (!stepValid) {
      toast.error('Please complete all required fields');
      return;
    }
    setDirection('forward');
    nextStep();
  };

  const handlePrev = () => {
    setDirection('back');
    prevStep();
  };

  const handleSaveAndExit = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to save');
        return;
      }

      const { error } = await supabase
        .from('vendor_profiles')
        .upsert({
          user_id: user.id,
          business_name: data.businessName,
          years_experience: data.yearsExperience,
          bio: data.bio,
          service_category: data.serviceCategory,
          skills: data.skills as unknown as never,
          certifications: data.certifications as unknown as never,
          portfolio: data.portfolio as unknown as never,
          onboarding_step: currentStep,
          onboarding_completed: false,
        } as never, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success('Progress saved! You can continue later.');
      onBack();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!stepValid) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to complete');
        return;
      }

      const { error } = await supabase
        .from('vendor_profiles')
        .upsert({
          user_id: user.id,
          business_name: data.businessName,
          years_experience: data.yearsExperience,
          bio: data.bio,
          service_category: data.serviceCategory,
          skills: data.skills as unknown as never,
          certifications: data.certifications as unknown as never,
          portfolio: data.portfolio as unknown as never,
          onboarding_step: TOTAL_STEPS,
          onboarding_completed: true,
        } as never, { onConflict: 'user_id' });

      if (error) throw error;

      setComplete(true);
      toast.success('Profile complete! Welcome aboard!');
      onComplete();
    } catch (error) {
      console.error('Complete error:', error);
      toast.error('Failed to complete onboarding');
    } finally {
      setIsSaving(false);
    }
  };

  const slideVariants = {
    enter: (dir: 'forward' | 'back') => ({
      x: dir === 'forward' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: 'forward' | 'back') => ({
      x: dir === 'forward' ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CoreIdentityStep onValidChange={handleValidChange} />;
      case 2:
        return <SkillsStep onValidChange={handleValidChange} />;
      case 3:
        return <CertificationsStep onValidChange={handleValidChange} />;
      case 4:
        return <PortfolioStep onValidChange={handleValidChange} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Tell us about your business';
      case 2: return 'What are your specialties?';
      case 3: return 'Verify your expertise';
      case 4: return 'Showcase your work';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-golden text-primary-foreground relative overflow-hidden">
        <StackPattern opacity="0.08" color="ffffff" className="absolute inset-0" />
        <div className="px-4 py-5 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-2xl bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold">Expertise Builder</h1>
              <p className="text-sm opacity-80">Step {currentStep} of {TOTAL_STEPS}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveAndExit}
              disabled={isSaving}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save & Exit
            </Button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-4 bg-card border-b border-border -mt-3 rounded-t-3xl relative z-10">
        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepLabels={STEP_LABELS}
        />
      </div>

      {/* Step Title */}
      <div className="px-4 py-4">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-foreground">
            {getStepTitle()}
          </h2>
        </motion.div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-hidden relative px-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
            className="h-full overflow-y-auto pb-4"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="p-4 bg-card border-t border-border safe-area-pb">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              className="flex-1 h-14 rounded-2xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          )}
          
          {currentStep < TOTAL_STEPS ? (
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!stepValid}
              className="flex-1 h-14 rounded-2xl bg-primary"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleComplete}
              disabled={!stepValid || isSaving}
              className="flex-1 h-14 rounded-2xl bg-gradient-golden"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete Setup
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorOnboardingScreen;
