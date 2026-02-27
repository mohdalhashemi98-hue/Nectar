import { motion } from 'framer-motion';
import { Target, Trophy, Coins, Flame, Gift, Sparkles, Gem, Zap, Star, PiggyBank, Crown, LucideIcon } from 'lucide-react';
import { Rewards, ScreenType, UserType } from '@/types/stack';
import { tierConfig } from '@/data/stack-data';
import BottomNav from '../BottomNav';

const achievementIcons: Record<string, LucideIcon> = { Trophy, Gem, Zap, Star, PiggyBank, Crown };

interface RewardsScreenProps {
  rewards: Rewards;
  userType: UserType;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

const RewardsScreen = ({ rewards, userType, onBack, onNavigate }: RewardsScreenProps) => {
  const r = {
    ...rewards,
    points: rewards?.points ?? 0,
    tier: rewards?.tier ?? 'Bronze',
    tierProgress: rewards?.tierProgress ?? 0,
    pointsToNextTier: rewards?.pointsToNextTier ?? 1000,
    nextTier: rewards?.nextTier ?? 'Silver',
    cashbackRate: rewards?.cashbackRate ?? 2,
    streak: rewards?.streak ?? 0,
    totalSaved: rewards?.totalSaved ?? 0,
    lifetimePoints: rewards?.lifetimePoints ?? 0,
    weeklyChallenge: rewards?.weeklyChallenge ?? { title: 'Complete 3 Payments', progress: 0, target: 3, reward: 150, endsIn: '3 days' },
    achievements: rewards?.achievements ?? [],
    recentEarnings: rewards?.recentEarnings ?? [],
  };

  return (
    <div className="w-full bg-background pb-24">
      {/* Header */}
      <div className="bg-background border-b border-border px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Rewards</h1>
            <p className="text-sm text-muted-foreground">{r.cashbackRate}% cashback rate</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Gift className="w-5 h-5 text-foreground" />
          </div>
        </div>

        {/* Tier Card */}
        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{tierConfig[r.tier]?.icon ?? '🥉'}</span>
              <div>
                <div className="text-lg font-bold text-foreground">{r.tier}</div>
                <div className="text-xs text-muted-foreground">Member</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">{r.points.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">points</div>
            </div>
          </div>
          <div className="mb-1.5">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{r.tier}</span>
              <span>{r.nextTier}</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${r.tierProgress}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>
          <div className="text-xs text-muted-foreground">{r.pointsToNextTier} pts to {r.nextTier}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { icon: Flame, value: `${r.streak} Day`, label: 'Streak' },
            { icon: Coins, value: r.totalSaved, label: 'AED Saved' },
            { icon: Sparkles, value: r.lifetimePoints.toLocaleString(), label: 'Lifetime' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-card rounded-xl p-3 border border-border text-center">
              <stat.icon className="w-4 h-4 mx-auto mb-1.5 text-muted-foreground" />
              <p className="font-bold text-foreground text-sm">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Weekly Challenge */}
        <div className="card-elevated p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-foreground text-sm">{r.weeklyChallenge.title}</div>
              <div className="text-xs text-muted-foreground">Ends in {r.weeklyChallenge.endsIn}</div>
            </div>
            <div className="text-primary font-bold text-sm">+{r.weeklyChallenge.reward}</div>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${r.weeklyChallenge.target > 0 ? (r.weeklyChallenge.progress / r.weeklyChallenge.target) * 100 : 0}%` }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="h-full bg-primary rounded-full"
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1.5">{r.weeklyChallenge.progress}/{r.weeklyChallenge.target}</div>
        </div>

        {/* Achievements */}
        <div className="card-elevated p-4 mb-4">
          <h3 className="font-medium text-foreground mb-3 text-sm flex items-center gap-2">
            <Trophy className="w-4 h-4" /> Achievements
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {r.achievements.map((a) => {
              const IconComponent = achievementIcons[a.icon] || Trophy;
              const progress = a.progress && a.target ? Math.min((a.progress / a.target) * 100, 100) : 0;
              return (
                <div key={a.id} className={`text-center p-2.5 rounded-xl ${a.earned ? 'bg-primary/5 border border-primary/15' : 'bg-secondary/30 border border-border/50'}`}>
                  <div className={`w-9 h-9 mx-auto mb-1.5 rounded-xl flex items-center justify-center ${a.earned ? 'bg-primary text-primary-foreground' : 'bg-muted/60'}`}>
                    <IconComponent className={`w-4 h-4 ${a.earned ? '' : 'text-muted-foreground/60'}`} />
                  </div>
                  <div className={`text-[10px] font-medium leading-tight ${a.earned ? 'text-foreground' : 'text-muted-foreground/60'}`}>{a.name}</div>
                  {!a.earned && a.progress !== undefined && a.target !== undefined && (
                    <div className="mt-1">
                      <div className="h-1 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary/50 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="text-[9px] text-muted-foreground mt-0.5">{a.progress}/{a.target}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Earnings */}
        <div className="card-elevated p-4">
          <h3 className="font-medium text-foreground mb-3 text-sm flex items-center gap-2">
            <Coins className="w-4 h-4" /> Recent Earnings
          </h3>
          <div className="space-y-2">
            {r.recentEarnings.map((e, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="font-medium text-foreground text-sm">{e.description}</div>
                  <div className="text-xs text-muted-foreground">{e.date}</div>
                </div>
                <span className="font-bold text-primary text-sm">+{e.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="rewards" userType={userType} onNavigate={onNavigate} pendingQuotes={1} unreadMessages={2} />
    </div>
  );
};

export default RewardsScreen;
