import { motion } from 'framer-motion';
import { Settings, ChevronRight, User, CreditCard, Bell, Shield, HelpCircle, LogOut, Trophy, Sparkles } from 'lucide-react';
import { UserProfile, Rewards, ScreenType, UserType } from '@/types/mazaadi';
import BottomNav from '../BottomNav';

interface ProfileScreenProps {
  userProfile: UserProfile;
  rewards: Rewards;
  userType: UserType;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

const ProfileScreen = ({
  userProfile,
  rewards,
  userType,
  onNavigate,
  onLogout
}: ProfileScreenProps) => {
  const menuItems = [
    { icon: User, label: 'Personal Info', screen: null },
    { icon: CreditCard, label: 'Payment Methods', screen: null },
    { icon: Bell, label: 'Notifications', screen: 'notifications' as ScreenType },
    { icon: Shield, label: 'Privacy & Security', screen: null },
    { icon: HelpCircle, label: 'Help & Support', screen: null }
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-golden text-primary-foreground p-6 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/10 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <h1 className="font-display text-2xl font-bold">Profile</h1>
            <button className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary-foreground/20 backdrop-blur-sm rounded-3xl p-4 border border-primary-foreground/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-foreground/30 rounded-3xl flex items-center justify-center text-2xl font-bold">
                {userProfile.avatar}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{userProfile.name}</h3>
                <p className="opacity-70 text-sm">{userProfile.phone}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-primary-foreground/20 px-3 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold text-sm">{rewards.points.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 -mt-8 relative z-10 space-y-3">
        {/* Rewards Quick Access */}
        {userType === 'consumer' && (
          <motion.button 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ y: -2 }}
            onClick={() => onNavigate('rewards')} 
            className="w-full card-interactive p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">{rewards.tier} Member</div>
                <div className="text-sm text-muted-foreground">{rewards.cashbackRate}% cashback</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        )}

        {/* Menu Items */}
        {menuItems.map((item, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.03 }}
            whileHover={{ y: -2 }}
            onClick={() => item.screen && onNavigate(item.screen)}
            className="w-full card-interactive p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="font-semibold text-foreground">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        ))}

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -2 }}
          onClick={onLogout}
          className="w-full bg-card rounded-2xl border border-destructive/20 p-4 flex items-center gap-4 hover:bg-destructive/5 transition-all"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
            <LogOut className="w-5 h-5 text-destructive" />
          </div>
          <span className="font-semibold text-destructive">Log Out</span>
        </motion.button>
      </div>

      <BottomNav active="profile" userType={userType} onNavigate={onNavigate} />
    </div>
  );
};

export default ProfileScreen;