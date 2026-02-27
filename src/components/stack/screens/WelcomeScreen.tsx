import { motion } from 'framer-motion';
import { ChevronRight, Home, Briefcase, Shield, Award, Sparkles, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserType } from '@/types/stack';
import { ThemeToggle } from '@/components/theme-toggle';
import StackLogo from '@/components/StackLogo';
import { triggerFeedback } from '@/hooks/use-feedback';
import StackPattern from '../StackPattern';

interface WelcomeScreenProps {
  onSelectUserType: (type: UserType) => void;
}

const handleSelectWithFeedback = (type: UserType, onSelect: (type: UserType) => void) => {
  triggerFeedback('tap');
  onSelect(type);
};

const WelcomeScreen = ({
  onSelectUserType
}: WelcomeScreenProps) => {
  const navigate = useNavigate();

  const handleBecomeAPro = () => {
    triggerFeedback('tap');
    navigate('/vendor/signup');
  };

  const handleImAPro = () => {
    triggerFeedback('tap');
    onSelectUserType('vendor');
  };

  return <div className="flex flex-col min-h-screen bg-[#0f172a] relative overflow-hidden">
    {/* Theme Toggle */}
    <div className="absolute top-4 right-4 z-20">
      <ThemeToggle />
    </div>
    
    {/* Stack pattern background */}
    <StackPattern opacity="0.04" color="3b82f6" className="absolute inset-0" />
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-80 h-80 bg-amber/10 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
    <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-amber/5 rounded-full blur-2xl" />
    
    <div className="relative flex-1 flex flex-col justify-center items-center px-4 z-10">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} className="mb-12 text-center">
        <motion.div initial={{
        scale: 0.8,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} transition={{
        delay: 0.2,
        duration: 0.5
      }} className="mb-6 relative flex items-center justify-center">
          <div className="absolute w-24 h-24 bg-amber/20 rounded-full blur-xl" />
          <motion.div animate={{
          y: [0, -6, 0]
        }} transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }} className="relative z-10 flex items-center justify-center">
            <StackLogo size={112} />
          </motion.div>
        </motion.div>
        <h1 className="font-display text-5xl font-bold text-white mb-3 tracking-tight">Stack</h1>
        <p className="text-lg text-amber/90">Verified Pros. <span className="text-amber font-semibold">Guaranteed Value.</span></p>
      </motion.div>

      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.4,
      duration: 0.5
    }} className="flex gap-10 mb-12 text-center">
        {[{
        value: '24K+',
        label: 'Active Pros'
      }, {
        value: '4.9★',
        label: 'Avg Rating'
      }, {
        value: '12%',
        label: 'Cashback'
      }].map((stat, idx) => <motion.div key={idx} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5 + idx * 0.1
      }}>
            <div className="font-display text-2xl font-bold text-amber">{stat.value}</div>
            <div className="text-xs text-blue-200/70 font-medium mt-0.5">{stat.label}</div>
          </motion.div>)}
      </motion.div>
      
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.6,
      duration: 0.5
    }} className="w-full max-w-sm space-y-3">
        {/* Primary CTA - I need help */}
        <motion.button whileHover={{
        scale: 1.02,
        y: -2
      }} whileTap={{
        scale: 0.98
      }} onClick={() => handleSelectWithFeedback('consumer', onSelectUserType)} className="group w-full py-5 px-5 rounded-xl transition-all duration-300" style={{
        background: 'linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(32 95% 55%) 100%)',
        boxShadow: '0 8px 24px -4px hsl(38 92% 56% / 0.35)'
      }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-display text-xl font-bold text-white">I need help</div>
                <div className="text-sm text-white/80">Post a job & get offers</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full">Popular</span>
              <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </motion.button>

        {/* Secondary CTA - I'm a Pro */}
        <motion.button whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} onClick={handleImAPro} className="group w-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber/30 py-5 px-5 rounded-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-amber/20 transition-all duration-300">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-display text-xl font-bold text-white">I'm a Pro</div>
                <div className="text-sm text-blue-200/70">Sign in to find jobs</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-amber group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </motion.button>
        
        {/* Become a Pro Link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={handleBecomeAPro}
          className="w-full py-3 text-center text-blue-200/70 font-medium hover:text-amber hover:underline flex items-center justify-center gap-2 transition-colors"
        >
          <Rocket className="w-4 h-4" />
          New here? Become a Pro today
        </motion.button>
      </motion.div>

      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.8,
      duration: 0.5
    }} className="mt-12 flex items-center gap-8 text-sm">
        {[{
        icon: Shield,
        label: 'Verified'
      }, {
        icon: Award,
        label: 'Licensed'
      }, {
        icon: Sparkles,
        label: 'Quality'
      }].map((item, idx) => <div key={idx} className="flex items-center gap-2 text-blue-200/70">
            <item.icon className="w-4 h-4 text-amber/70" />
            <span className="font-medium">{item.label}</span>
          </div>)}
      </motion.div>
    </div>
  </div>;
};

export default WelcomeScreen;
