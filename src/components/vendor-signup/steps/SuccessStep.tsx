import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface SuccessStepProps {
  primaryTrade: string;
  onGoToDashboard: () => void;
  onCompleteProfile: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ primaryTrade, onGoToDashboard, onCompleteProfile }) => {
  const hasPlayedConfetti = useRef(false);

  useEffect(() => {
    if (!hasPlayedConfetti.current) {
      hasPlayedConfetti.current = true;
      
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#1E90FF'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#1E90FF'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
          </div>
          
          {/* Sparkle decorations */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute -bottom-2 -left-2"
          >
            <Sparkles className="w-6 h-6 text-primary" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-display text-3xl font-bold text-foreground mb-3"
        >
          Welcome to Stack!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-muted-foreground mb-8"
        >
          You're now ready to receive job requests
        </motion.p>

        {/* Trade Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8"
        >
          <Briefcase className="w-4 h-4 text-primary" />
          <span className="font-medium text-primary">{primaryTrade} Professional</span>
        </motion.div>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-sm bg-card rounded-3xl p-6 shadow-lg border border-border/50 mb-8"
        >
          <h3 className="font-semibold text-foreground mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">1</div>
              <span className="text-sm text-muted-foreground">Complete your expertise profile</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">2</div>
              <span className="text-sm text-muted-foreground">Add your portfolio & certifications</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">3</div>
              <span className="text-sm text-muted-foreground">Start receiving job requests</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="p-4 pb-8 space-y-3"
      >
        <Button
          onClick={onCompleteProfile}
          className="w-full h-14 rounded-2xl text-lg font-semibold"
        >
          Complete Expertise Profile
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        
        <Button
          variant="outline"
          onClick={onGoToDashboard}
          className="w-full h-12 rounded-2xl"
        >
          Go to Dashboard
        </Button>
      </motion.div>
    </div>
  );
};

export default SuccessStep;
