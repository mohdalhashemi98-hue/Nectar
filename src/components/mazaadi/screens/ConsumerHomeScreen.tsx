import { motion } from 'framer-motion';
import { Bell, Search, Plus, Star, Heart, ChevronRight, TrendingUp, Sparkles } from 'lucide-react';
import { Rewards, Vendor, Job, Notification, ScreenType } from '@/types/mazaadi';
import { tierConfig, categories } from '@/data/mazaadi-data';
import BottomNav from '../BottomNav';

interface ConsumerHomeScreenProps {
  userProfile: { name: string };
  rewards: Rewards;
  previousVendors: Vendor[];
  jobs: Job[];
  notifications: Notification[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectCategory: (category: string) => void;
  onSelectVendor: (vendor: Vendor) => void;
  onSelectJob: (job: Job) => void;
  onResetRequestForm: () => void;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  'Completed': { bg: 'bg-foreground/10', text: 'text-foreground' },
  'In Progress': { bg: 'bg-foreground/10', text: 'text-foreground' },
  'Pending': { bg: 'bg-warning/10', text: 'text-warning' },
  'Awaiting Completion': { bg: 'bg-foreground/5', text: 'text-muted-foreground' },
  'Cancelled': { bg: 'bg-destructive/10', text: 'text-destructive' }
};

const ConsumerHomeScreen = ({
  userProfile,
  rewards,
  previousVendors,
  jobs,
  notifications,
  searchQuery,
  setSearchQuery,
  onNavigate,
  onSelectCategory,
  onSelectVendor,
  onSelectJob,
  onResetRequestForm
}: ConsumerHomeScreenProps) => {
  const searchResults = searchQuery.length > 0 
    ? categories.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : [];

  const activeJobs = jobs.filter(j => j.status === 'In Progress' || j.status === 'Awaiting Completion');

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-6 py-5">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-5"
          >
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-0.5">
                Hi, {userProfile.name.split(' ')[0]}
              </h1>
              <p className="text-sm text-muted-foreground">What can we help with today?</p>
            </div>
            <button 
              onClick={() => onNavigate('notifications')} 
              className="relative p-3 bg-secondary rounded-2xl hover:bg-secondary/80 transition-colors"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-foreground rounded-full" />
              )}
            </button>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-modern pl-12"
            />
          </motion.div>

          {/* Search Results */}
          {searchQuery.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 bg-card rounded-2xl border border-border overflow-hidden"
              style={{ boxShadow: 'var(--shadow-lg)' }}
            >
              {searchResults.length > 0 ? (
                searchResults.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      onSelectCategory(cat.name);
                      setSearchQuery('');
                      onNavigate('post-request');
                    }}
                    className="w-full p-4 flex items-center gap-3 hover:bg-secondary/50 border-b border-border last:border-0 transition-colors"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <div className="text-left">
                      <div className="font-semibold text-foreground">{cat.name}</div>
                      <div className="text-xs text-muted-foreground">{cat.description}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">No services found</div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 pb-24 space-y-6">
        {/* Rewards Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-foreground rounded-3xl p-5 text-background"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-background/10 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">{tierConfig[rewards.tier].icon}</span>
              </div>
              <div>
                <div className="font-display font-bold text-lg">{rewards.tier} Member</div>
                <div className="text-sm opacity-60">{rewards.cashbackRate}% cashback</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl font-bold">{rewards.points.toLocaleString()}</div>
              <div className="text-xs opacity-60">points</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-background/10 rounded-xl px-3 py-2 mb-4">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">{rewards.streak} day streak</span>
            <span className="text-xs bg-background/20 px-2 py-0.5 rounded-full ml-auto">2x points</span>
          </div>
          <button 
            onClick={() => onNavigate('rewards')} 
            className="w-full bg-background text-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-background/90 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            View Rewards
          </button>
        </motion.div>

        {/* Quick Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-1">Need something done?</h3>
              <p className="text-muted-foreground text-sm">Get instant quotes from verified pros</p>
            </div>
          </div>
          <button
            onClick={() => { onResetRequestForm(); onNavigate('post-request'); }}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Post a Job
          </button>
        </motion.div>

        {/* Quick Re-hire */}
        {previousVendors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-foreground">Quick Re-hire</h3>
              <button onClick={() => onNavigate('previous-vendors')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                View All
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
              {previousVendors.slice(0, 3).map((vendor) => (
                <motion.button
                  key={vendor.id}
                  whileHover={{ y: -4 }}
                  onClick={() => { onSelectVendor(vendor); onNavigate('vendor-profile'); }}
                  className="flex-shrink-0 w-32 bg-card p-4 rounded-2xl border border-border transition-all duration-300 group"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <div className="relative mb-3">
                    <div className="avatar-primary w-12 h-12 text-lg mx-auto">
                      {vendor.avatar}
                    </div>
                    {vendor.favorite && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-foreground rounded-full flex items-center justify-center">
                        <Heart className="w-3 h-3 text-background fill-current" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1 truncate text-center">{vendor.name}</h4>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Star className="w-3 h-3 text-foreground fill-foreground" />
                    <span className="text-xs font-bold">{vendor.rating}</span>
                  </div>
                  <div className="w-full py-2 bg-secondary text-foreground rounded-lg text-xs font-semibold text-center group-hover:bg-foreground group-hover:text-background transition-colors">
                    Re-hire
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Popular Services</h3>
          <div className="grid grid-cols-3 gap-3">
            {categories.slice(0, 6).map((cat) => (
              <motion.button
                key={cat.name}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onSelectCategory(cat.name); onResetRequestForm(); onNavigate('post-request'); }}
                className="bg-card p-4 rounded-2xl border border-border hover:border-foreground/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-xl mb-2 mx-auto group-hover:bg-foreground group-hover:scale-110 transition-all duration-300">
                  <span className="group-hover:scale-110 transition-transform">{cat.icon}</span>
                </div>
                <div className="text-xs font-medium text-foreground text-center">{cat.name}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Active Jobs */}
        {activeJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-foreground">Active Jobs</h3>
              <button onClick={() => onNavigate('transactions')} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {activeJobs.slice(0, 2).map((job) => (
                <motion.button
                  key={job.id}
                  whileHover={{ y: -2 }}
                  onClick={() => { onSelectJob(job); onNavigate('job-detail'); }}
                  className="card-interactive w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{job.title}</h4>
                    <span className={`px-2.5 py-1 ${statusColors[job.status].bg} ${statusColors[job.status].text} text-xs font-semibold rounded-full`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{job.vendor}</span>
                    <span className="font-bold text-foreground">{job.amount} AED</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav active="home" userType="consumer" onNavigate={onNavigate} />
    </div>
  );
};

export default ConsumerHomeScreen;