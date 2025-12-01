import { motion } from 'framer-motion';
import { Target, Trophy, Coins, Flame, Gift, Sparkles } from 'lucide-react';
import { Rewards, ScreenType, UserType } from '@/types/mazaadi';
import { tierConfig } from '@/data/mazaadi-data';
import BottomNav from '../BottomNav';

interface RewardsScreenProps {
  rewards: Rewards;
  userType: UserType;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

const RewardsScreen = ({ rewards, userType, onBack, onNavigate }: RewardsScreenProps) => {
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
            className="flex items-center gap-4 mb-6"
          >
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold">My Rewards</h1>
              <p className="opacity-70 text-sm">{rewards.cashbackRate}% cashback rate</p>
            </div>
            <div className="w-12 h-12 rounded-3xl bg-primary-foreground/20 flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
          </motion.div>

          {/* Tier Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary-foreground/20 backdrop-blur-sm rounded-3xl p-4 border border-primary-foreground/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{tierConfig[rewards.tier].icon}</span>
                <div>
                  <div className="text-xl font-bold">{rewards.tier}</div>
                  <div className="opacity-70 text-sm">Member</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{rewards.points.toLocaleString()}</div>
                <div className="opacity-70 text-sm">points</div>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1.5 opacity-70">
                <span>{rewards.tier}</span>
                <span>{rewards.nextTier}</span>
              </div>
              <div className="h-2 bg-primary-foreground/30 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${rewards.tierProgress}%` }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="h-full bg-primary-foreground rounded-full" 
                />
              </div>
            </div>
            <div className="text-xs opacity-70">{rewards.pointsToNextTier} pts to {rewards.nextTier}</div>
          </motion.div>
        </div>
      </div>

      {/* Stats Row - Floating */}
      <div className="px-4 -mt-8 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-2"
        >
          {[
            { icon: Flame, value: `${rewards.streak} Day`, label: 'Streak' },
            { icon: Coins, value: rewards.totalSaved, label: 'AED Saved' },
            { icon: Sparkles, value: rewards.lifetimePoints.toLocaleString(), label: 'Lifetime' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-card rounded-2xl p-3 border border-border" style={{ boxShadow: 'var(--shadow-md)' }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-foreground" />
                </div>
                <p className="font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pt-6">
        {/* Weekly Challenge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground">{rewards.weeklyChallenge.title}</div>
              <div className="text-xs text-muted-foreground">Ends in {rewards.weeklyChallenge.endsIn}</div>
            </div>
            <div className="text-primary font-bold">+{rewards.weeklyChallenge.reward}</div>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(rewards.weeklyChallenge.progress / rewards.weeklyChallenge.target) * 100}%` }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="h-full bg-primary rounded-full" 
            />
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {rewards.weeklyChallenge.progress}/{rewards.weeklyChallenge.target} completed
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card-elevated p-4"
        >
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievements
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {rewards.achievements.map((a) => (
              <motion.div 
                key={a.id} 
                whileHover={{ scale: 1.05 }}
                className={`text-center p-3 rounded-xl transition-all ${
                  a.earned ? 'bg-foreground/5 border border-foreground/10' : 'bg-secondary opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{a.icon}</div>
                <div className="text-xs font-medium text-foreground">{a.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Earnings */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevated p-4"
        >
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Recent Earnings
          </h3>
          <div className="space-y-3">
            {rewards.recentEarnings.map((e, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="font-medium text-foreground text-sm">{e.description}</div>
                  <div className="text-xs text-muted-foreground">{e.date}</div>
                </div>
                <span className="font-bold text-foreground">+{e.points}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <BottomNav active="rewards" userType={userType} onNavigate={onNavigate} />
    </div>
  );
};

export default RewardsScreen;