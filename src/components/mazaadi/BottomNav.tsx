import { Home, Briefcase, Gift, MessageCircle, User } from 'lucide-react';
import { UserType, ScreenType } from '@/types/mazaadi';

interface BottomNavProps {
  active: string;
  userType: UserType;
  onNavigate: (screen: ScreenType) => void;
}

const BottomNav = ({ active, userType, onNavigate }: BottomNavProps) => {
  const navItems = [
    { key: 'home', icon: Home, label: 'Home', screen: (userType === 'consumer' ? 'consumer-home' : 'vendor-home') as ScreenType },
    { key: 'transactions', icon: Briefcase, label: userType === 'consumer' ? 'Jobs' : 'Work', screen: 'transactions' as ScreenType },
    { key: 'rewards', icon: Gift, label: 'Rewards', screen: 'rewards' as ScreenType },
    { key: 'messages', icon: MessageCircle, label: 'Chat', screen: 'messages-list' as ScreenType },
    { key: 'profile', icon: User, label: 'Profile', screen: 'profile' as ScreenType }
  ];

  return (
    <div className="bg-card/95 backdrop-blur-xl border-t border-border px-4 py-2 fixed bottom-0 left-0 right-0 max-w-md mx-auto safe-area-pb z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.screen)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
              active === item.key 
                ? 'bg-primary/10 scale-105' 
                : 'hover:bg-muted'
            }`}
          >
            <item.icon 
              className={`w-5 h-5 transition-colors duration-300 ${
                active === item.key ? 'text-primary' : 'text-muted-foreground'
              }`} 
            />
            <span 
              className={`text-xs font-semibold transition-colors duration-300 ${
                active === item.key ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
