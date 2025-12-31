import { motion, AnimatePresence } from 'framer-motion';
import { Home, TrendingUp, Gift, MessageCircle, User, Building2, Briefcase } from 'lucide-react';
import { UserType, ScreenType } from '@/types/stack';
import { triggerFeedback } from '@/hooks/use-feedback';
import { usePreloadOnIntent } from '@/hooks/use-preload-on-intent';

interface BottomNavProps {
  active: string;
  userType: UserType;
  onNavigate: (screen: ScreenType) => void;
  pendingQuotes?: number;
  unreadMessages?: number;
}

// Map screen types to routes for preloading
const screenToRoute: Record<string, string> = {
  'vendor-home': '/vendor',
  'consumer-home': '/consumer',
  'transactions': '/jobs',
  'company-profile': '/company-profile',
  'messages-list': '/messages',
  'profile': '/profile',
  'market-benchmark': '/market-benchmark',
  'rewards': '/rewards',
};

const BottomNav = ({ active, userType, onNavigate, pendingQuotes = 0, unreadMessages = 0 }: BottomNavProps) => {
  const { preloadOnIntent } = usePreloadOnIntent();
  
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

  const handleNavClick = (screen: ScreenType) => {
    triggerFeedback('tap');
    onNavigate(screen);
  };

  const handlePreload = (screen: ScreenType) => {
    const route = screenToRoute[screen];
    if (route) {
      preloadOnIntent(route);
    }
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 px-2 py-2 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = active === item.key;
          return (
            <motion.button
              key={item.key}
              onClick={() => handleNavClick(item.screen)}
              onMouseEnter={() => handlePreload(item.screen)}
              onTouchStart={() => handlePreload(item.screen)}
              whileTap={{ scale: 0.92 }}
              className={`relative flex flex-col items-center gap-0.5 px-5 py-2.5 rounded-2xl transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary/70'
              }`}
            >
              {/* Animated pill indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-primary/12 rounded-2xl"
                  initial={false}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 30,
                    mass: 0.8
                  }}
                />
              )}
              
              {/* Active glow effect */}
              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 rounded-2xl"
                  initial={false}
                  style={{
                    background: 'radial-gradient(ellipse at center bottom, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
                  }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 30,
                    mass: 0.8
                  }}
                />
              )}
              
              <div className="relative z-10">
                <motion.div
                  animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                  whileTap={{ scale: 0.85, rotate: -5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                </motion.div>
                <AnimatePresence>
                  {item.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              
              <motion.span 
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.8, y: 0 }}
                className={`text-[10px] font-semibold relative z-10 ${isActive ? 'font-bold' : ''}`}
              >
                {item.label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomNav;