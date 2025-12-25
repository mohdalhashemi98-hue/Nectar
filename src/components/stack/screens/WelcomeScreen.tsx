import { motion } from 'framer-motion';
import { ChevronRight, Home, Briefcase, Shield, Award, Sparkles } from 'lucide-react';
import { UserType } from '@/types/stack';
interface WelcomeScreenProps {
  onSelectUserType: (type: UserType) => void;
}
const WelcomeScreen = ({
  onSelectUserType
}: WelcomeScreenProps) => <div className="flex flex-col h-screen bg-background relative overflow-hidden">
    {/* Honeycomb pattern background */}
    <div className="absolute inset-0 opacity-[0.04]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }} />
    {/* Decorative elements - warm amber tones */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.08] rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/[0.05] rounded-full blur-3xl" />
    <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/[0.06] rounded-full blur-2xl" />
    
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
      }} className="mb-6 relative">
          <div className="absolute inset-0 w-28 h-28 mx-auto bg-primary/30 rounded-full blur-xl animate-pulse" />
          <motion.img alt="Stack Logo" animate={{
          y: [0, -8, 0]
        }} transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }} src="/lovable-uploads/295de576-689e-44cb-baa0-5e4a8954d2c5.png" className="w-28 h-28 mx-auto bg-background rounded-none object-cover relative z-10" />
        </motion.div>
        <h1 className="font-display text-5xl font-bold text-foreground mb-3 tracking-tight">Stack</h1>
        <p className="text-lg text-muted-foreground">Verified Pros. Guaranteed Value.</p>
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
            <div className="font-display text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</div>
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
    }} className="w-full max-w-sm space-y-4">
        <motion.button whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} onClick={() => onSelectUserType('consumer')} className="group w-full bg-card border-2 border-border hover:border-primary/30 py-5 px-5 rounded-3xl transition-all duration-300" style={{
        boxShadow: 'var(--shadow-md)'
      }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-secondary rounded-3xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Home className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-display text-xl font-bold text-foreground">I need help</div>
                <div className="text-sm text-muted-foreground">Post a job & get offers</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </motion.button>

        <motion.button whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} onClick={() => onSelectUserType('vendor')} className="card-gradient-animated group w-full text-primary-foreground py-5 px-5 transition-all duration-300">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-foreground/20 rounded-3xl flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-display text-xl font-bold">I'm a Pro</div>
                <div className="text-sm opacity-80">Find jobs & earn money</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition-all duration-300" />
          </div>
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
        label: 'Verified',
        color: 'text-verified'
      }, {
        icon: Award,
        label: 'Licensed',
        color: 'text-primary'
      }, {
        icon: Sparkles,
        label: 'Quality',
        color: 'text-primary'
      }].map((item, idx) => <div key={idx} className={`flex items-center gap-2 ${item.color}`}>
            <item.icon className="w-4 h-4" />
            <span className="font-medium">{item.label}</span>
          </div>)}
      </motion.div>
    </div>
  </div>;
export default WelcomeScreen;