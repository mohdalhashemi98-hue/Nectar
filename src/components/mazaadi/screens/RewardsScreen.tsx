import { ChevronLeft, Target, Trophy, Coins, Flame } from 'lucide-react';
import { Rewards, ScreenType, UserType } from '@/types/mazaadi';
import { tierConfig } from '@/data/mazaadi-data';
import BottomNav from '../BottomNav';

interface RewardsScreenProps {
  rewards: Rewards;
  userType: UserType;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

const RewardsScreen = ({ rewards, userType, onBack, onNavigate }: RewardsScreenProps) => (
  <div className="flex flex-col h-screen bg-background">
    <div className="bg-gradient-gold text-warning-foreground">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-5 animate-fade-in">
          <button onClick={onBack} className="p-2 bg-warning-foreground/20 rounded-xl hover:bg-warning-foreground/30 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">My Rewards</h2>
          <div className="w-10" />
        </div>

        <div className="glass-dark rounded-3xl p-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-bounce-subtle">{tierConfig[rewards.tier].icon}</span>
              <div>
                <div className="text-2xl font-extrabold">{rewards.tier}</div>
                <div className="text-warning-foreground/70 text-sm">{rewards.cashbackRate}% cashback</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold">{rewards.points.toLocaleString()}</div>
              <div className="text-warning-foreground/70 text-sm">points</div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span>{rewards.tier}</span>
              <span>{rewards.nextTier}</span>
            </div>
            <div className="h-3 bg-warning-foreground/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-warning-foreground rounded-full transition-all duration-500" 
                style={{ width: `${rewards.tierProgress}%` }} 
              />
            </div>
          </div>
          <div className="text-xs text-warning-foreground/70">{rewards.pointsToNextTier} pts to {rewards.nextTier}</div>
        </div>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto px-6 py-5 pb-24 space-y-5">
      {/* Streak */}
      <div className="bg-gradient-to-r from-orange-500 to-destructive rounded-2xl p-4 text-destructive-foreground flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce-subtle">🔥</span>
          <div>
            <div className="text-xl font-extrabold">{rewards.streak} Day Streak</div>
            <div className="text-destructive-foreground/70 text-sm">2x points active!</div>
          </div>
        </div>
      </div>

      {/* Challenge */}
      <div className="card-elevated p-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-3">
          <Target className="w-6 h-6 text-accent" />
          <div className="flex-1">
            <div className="font-bold text-foreground">{rewards.weeklyChallenge.title}</div>
            <div className="text-xs text-muted-foreground">Ends in {rewards.weeklyChallenge.endsIn}</div>
          </div>
          <div className="text-accent font-bold">+{rewards.weeklyChallenge.reward}</div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent rounded-full transition-all duration-500" 
            style={{ width: `${(rewards.weeklyChallenge.progress / rewards.weeklyChallenge.target) * 100}%` }} 
          />
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {rewards.weeklyChallenge.progress}/{rewards.weeklyChallenge.target} completed
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="card-elevated p-4 text-center">
          <div className="text-2xl font-extrabold text-success">{rewards.totalSaved}</div>
          <div className="text-xs text-muted-foreground">AED Saved</div>
        </div>
        <div className="card-elevated p-4 text-center">
          <div className="text-2xl font-extrabold text-warning">{rewards.lifetimePoints.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Lifetime Points</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card-elevated p-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          Achievements
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {rewards.achievements.map((a) => (
            <div 
              key={a.id} 
              className={`text-center p-3 rounded-xl transition-all duration-300 ${
                a.earned ? 'bg-warning/10 hover:scale-105' : 'bg-muted opacity-50'
              }`}
            >
              <div className="text-2xl mb-1">{a.icon}</div>
              <div className="text-xs font-medium text-foreground">{a.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Earnings */}
      <div className="card-elevated p-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Coins className="w-5 h-5 text-warning" />
          Recent Earnings
        </h3>
        <div className="space-y-3">
          {rewards.recentEarnings.map((e, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <div className="font-medium text-foreground text-sm">{e.description}</div>
                <div className="text-xs text-muted-foreground">{e.date}</div>
              </div>
              <span className="font-bold text-success">+{e.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <BottomNav active="rewards" userType={userType} onNavigate={onNavigate} />
  </div>
);

export default RewardsScreen;
