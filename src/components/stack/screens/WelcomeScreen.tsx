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
    <div className="flex flex-col min-h-screen bg-[#0f172a] relative">
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
          <h1 className="font-display text-4xl font-bold text-white mb-2">Stack</h1>
          <p className="text-slate-400 text-base">Verified Pros. Guaranteed Value.</p>
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
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-white">I need help</div>
                  <div className="text-sm text-white/70">Post a job & get offers</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/60" />
            </div>
          </button>

          {/* Secondary CTA */}
          <button
            onClick={handleImAPro}
            className="group w-full py-4 px-5 rounded-xl border border-white/15 hover:border-white/30 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-white">I'm a Pro</div>
                  <div className="text-sm text-slate-400">Sign in to find jobs</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </div>
          </button>

          {/* Become a Pro */}
          <button
            onClick={handleBecomeAPro}
            className="w-full py-3 text-center text-slate-400 text-sm font-medium hover:text-white flex items-center justify-center gap-2 transition-colors"
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
