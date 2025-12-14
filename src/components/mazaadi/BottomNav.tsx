import { motion, AnimatePresence } from 'framer-motion';
import { Home, TrendingUp, Gift, MessageCircle, User, Building2, Briefcase } from 'lucide-react';
import { UserType, ScreenType } from '@/types/mazaadi';

interface BottomNavProps {
  active: string;
  userType: UserType;
  onNavigate: (screen: ScreenType) => void;
  pendingQuotes?: number;
  unreadMessages?: number;
}

const BottomNav = ({ active, userType, onNavigate, pendingQuotes = 0, unreadMessages = 0 }: BottomNavProps) => {
  const navItems = userType === 'vendor' 
    ? [
        { key: 'home', icon: Home, label: 'Home', screen: 'vendor-home' as ScreenType, badge: 0 },
        { key: 'transactions', icon: Briefcase, label: 'Work', screen: 'transactions' as ScreenType, badge: 0 },
        { key: 'company', icon: Building2, label: 'Company', screen: 'company-profile' as ScreenType, badge: 0 },
        { key: 'messages', icon: MessageCircle, label: 'Chat', screen: 'messages-list' as ScreenType, badge: unreadMessages },
        { key: 'profile', icon: User, label: 'Profile', screen: 'profile' as ScreenType, badge: 0 }
      ]
    : [
        { key: 'home', icon: Home, label: 'Home', screen: 'consumer-home' as ScreenType, badge: 0 },
        { key: 'benchmark', icon: TrendingUp, label: 'Benchmark', screen: 'market-benchmark' as ScreenType, badge: 0 },
        { key: 'rewards', icon: Gift, label: 'Rewards', screen: 'rewards' as ScreenType, badge: 0 },
        { key: 'messages', icon: MessageCircle, label: 'Chat', screen: 'messages-list' as ScreenType, badge: unreadMessages },
        { key: 'profile', icon: User, label: 'Profile', screen: 'profile' as ScreenType, badge: pendingQuotes }
      ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-card/95 backdrop-blur-xl border-t border-border px-2 py-2 fixed bottom-0 left-0 right-0 max-w-md mx-auto safe-area-pb z-50"
    >
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = active === item.key;
          return (
            <motion.button
              key={item.key}
              onClick={() => onNavigate(item.screen)}
              whileTap={{ scale: 0.9 }}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <item.icon className="w-5 h-5 relative z-10" />
                <AnimatePresence>
                  {item.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1 z-20"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-[10px] font-semibold relative z-10">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomNav;