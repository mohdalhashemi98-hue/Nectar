import { Settings, ChevronRight, User, CreditCard, Bell, Shield, HelpCircle, LogOut, Trophy } from 'lucide-react';
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
}: ProfileScreenProps) => (
  <div className="flex flex-col h-screen bg-background">
    <div className="bg-gradient-primary text-primary-foreground px-6 pt-6 pb-8">
      <div className="flex items-center justify-between mb-4 animate-fade-in">
        <h2 className="text-2xl font-bold">Profile</h2>
        <button className="p-2 bg-primary-foreground/20 rounded-xl hover:bg-primary-foreground/30 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="glass-dark rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-foreground/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
            {userProfile.avatar}
          </div>
          <div>
            <h3 className="text-xl font-bold">{userProfile.name}</h3>
            <p className="text-primary-foreground/70 text-sm">{userProfile.phone}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto px-6 py-5 pb-24 space-y-3">
      {/* Rewards Quick Access */}
      <button 
        onClick={() => onNavigate('rewards')} 
        className="w-full bg-gradient-to-r from-warning/10 to-warning/20 p-4 rounded-2xl border border-warning/30 flex items-center justify-between hover:shadow-lg transition-all duration-300 animate-fade-in"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center shadow">
            <Trophy className="w-5 h-5 text-warning-foreground" />
          </div>
          <div className="text-left">
            <div className="font-bold text-foreground">{rewards.tier} Member</div>
            <div className="text-sm text-warning">{rewards.points.toLocaleString()} pts</div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-warning" />
      </button>

      {/* Menu */}
      {[
        { icon: User, label: 'Personal Info', screen: null },
        { icon: CreditCard, label: 'Payment Methods', screen: null },
        { icon: Bell, label: 'Notifications', screen: 'notifications' as ScreenType },
        { icon: Shield, label: 'Privacy & Security', screen: null },
        { icon: HelpCircle, label: 'Help & Support', screen: null }
      ].map((item, i) => (
        <button
          key={i}
          onClick={() => item.screen && onNavigate(item.screen)}
          className="w-full p-4 bg-card rounded-2xl border border-border flex items-center justify-between hover:shadow-md hover:border-primary/20 transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${0.1 * (i + 1)}s` }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
              <item.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="font-semibold text-foreground">{item.label}</span>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      ))}

      <button
        onClick={onLogout}
        className="w-full p-4 bg-card rounded-2xl border border-destructive/20 flex items-center gap-4 hover:bg-destructive/5 transition-all duration-300 animate-fade-in"
        style={{ animationDelay: '0.6s' }}
      >
        <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
          <LogOut className="w-5 h-5 text-destructive" />
        </div>
        <span className="font-semibold text-destructive">Log Out</span>
      </button>
    </div>

    <BottomNav active="profile" userType={userType} onNavigate={onNavigate} />
  </div>
);

export default ProfileScreen;
