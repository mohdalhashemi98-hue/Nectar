import { motion } from 'framer-motion';
import { ChevronRight, Home, Briefcase, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserType } from '@/types/stack';
import { ThemeToggle } from '@/components/theme-toggle';
import StackLogo from '@/components/StackLogo';
import { triggerFeedback } from '@/hooks/use-feedback';

interface WelcomeScreenProps {
  onSelectUserType: (type: UserType) => void;
}

const WelcomeScreen = ({ onSelectUserType }: WelcomeScreenProps) => {
  const navigate = useNavigate();

  const handleNeedHelp = () => {
    triggerFeedback('tap');
    onSelectUserType('consumer');
  };

  const handleImAPro = () => {
    triggerFeedback('tap');
    onSelectUserType('vendor');
  };

  const handleBecomeAPro = () => {
    triggerFeedback('tap');
    navigate('/vendor/signup');
  };

  return (
    <div className="dark flex flex-col min-h-full bg-background relative">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="mb-6 flex items-center justify-center">
            <StackLogo size={96} />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">Stack</h1>
          <p className="text-muted-foreground text-base">Verified Pros. Guaranteed Value.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-sm space-y-3"
        >
          {/* Primary CTA */}
          <button
            onClick={handleNeedHelp}
            className="group w-full py-4 px-5 rounded-xl bg-primary hover:opacity-90 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-primary-foreground">I need help</div>
                  <div className="text-sm text-primary-foreground/70">Post a job & get offers</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-primary-foreground/60" />
            </div>
          </button>

          {/* Secondary CTA */}
          <button
            onClick={handleImAPro}
            className="group w-full py-4 px-5 rounded-xl border border-foreground/15 hover:border-foreground/30 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-foreground/10 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-foreground" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-foreground">I'm a Pro</div>
                  <div className="text-sm text-muted-foreground">Sign in to find jobs</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground/40" />
            </div>
          </button>

          {/* Become a Pro */}
          <button
            onClick={handleBecomeAPro}
            className="w-full py-3 text-center text-muted-foreground text-sm font-medium hover:text-foreground flex items-center justify-center gap-2 transition-colors"
          >
            <Rocket className="w-4 h-4" />
            New here? Become a Pro today
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
