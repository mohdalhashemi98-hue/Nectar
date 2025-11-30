import { motion } from 'framer-motion';
import { ChevronRight, Home, Briefcase, Shield, Award, Sparkles } from 'lucide-react';
import { UserType } from '@/types/mazaadi';

interface WelcomeScreenProps {
  onSelectUserType: (type: UserType) => void;
}

const WelcomeScreen = ({ onSelectUserType }: WelcomeScreenProps) => (
  <div className="flex flex-col h-screen bg-background relative overflow-hidden">
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-foreground/[0.02] rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-foreground/[0.03] rounded-full blur-3xl" />
    <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-foreground/[0.02] rounded-full blur-2xl" />
    
    <div className="relative flex-1 flex flex-col justify-center items-center px-6 z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-foreground rounded-3xl mb-6"
        >
          <span className="text-4xl">🤝</span>
        </motion.div>
        <h1 className="font-display text-5xl font-bold text-foreground mb-3 tracking-tight">Mazaadi</h1>
        <p className="text-lg text-muted-foreground">Find. Connect. Complete.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex gap-10 mb-12 text-center"
      >
        {[
          { value: '24K+', label: 'Active Pros' },
          { value: '4.9★', label: 'Avg Rating' },
          { value: '12%', label: 'Cashback' }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
          >
            <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full max-w-sm space-y-4"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectUserType('consumer')}
          className="group w-full bg-card border-2 border-border hover:border-foreground/30 py-5 px-5 rounded-3xl transition-all duration-300"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                <Home className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-display text-xl font-bold text-foreground">I need help</div>
                <div className="text-sm text-muted-foreground">Post a job & get offers</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectUserType('vendor')}
          className="group w-full bg-foreground text-background py-5 px-5 rounded-3xl transition-all duration-300"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-background/10 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-display text-xl font-bold">I'm a Pro</div>
                <div className="text-sm opacity-70">Find jobs & earn money</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-12 flex items-center gap-8 text-sm"
      >
        {[
          { icon: Shield, label: 'Verified' },
          { icon: Award, label: 'Licensed' },
          { icon: Sparkles, label: 'Quality' }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-muted-foreground">
            <item.icon className="w-4 h-4" />
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  </div>
);

export default WelcomeScreen;