import { Bell, Search, Gift, Plus, Zap, Flame, Star, Heart, ChevronRight } from 'lucide-react';
import { Rewards, Vendor, Job, Category, Notification, ScreenType } from '@/types/mazaadi';
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
  'Completed': { bg: 'bg-success/10', text: 'text-success' },
  'In Progress': { bg: 'bg-primary/10', text: 'text-primary' },
  'Pending': { bg: 'bg-warning/10', text: 'text-warning' },
  'Awaiting Completion': { bg: 'bg-accent/10', text: 'text-accent' },
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
          <div className="flex items-center justify-between mb-5">
            <div className="animate-fade-in">
              <h1 className="text-2xl font-extrabold text-foreground mb-1">Hi, {userProfile.name.split(' ')[0]} 👋</h1>
              <p className="text-sm text-muted-foreground">What can we help with today?</p>
            </div>
            <button 
              onClick={() => onNavigate('notifications')} 
              className="relative p-3 bg-muted rounded-2xl hover:bg-muted/80 transition-colors"
            >
              <Bell className="w-5 h-5 text-foreground" />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-card animate-pulse" />
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-modern pl-12"
            />
          </div>

          {/* Search Results */}
          {searchQuery.length > 0 && (
            <div className="mt-3 bg-card rounded-2xl border border-border overflow-hidden shadow-lg animate-scale-in">
              {searchResults.length > 0 ? (
                searchResults.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      onSelectCategory(cat.name);
                      setSearchQuery('');
                      onNavigate('post-request');
                    }}
                    className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 border-b border-border last:border-0 transition-colors"
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
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 pb-24 space-y-6">
        {/* Rewards Card */}
        <div className="bg-gradient-gold rounded-3xl p-5 text-warning-foreground shadow-gold animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{tierConfig[rewards.tier].icon}</span>
              <div>
                <div className="font-bold">{rewards.tier} Member</div>
                <div className="text-xs opacity-80">{rewards.cashbackRate}% cashback</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold">{rewards.points.toLocaleString()}</div>
              <div className="text-xs opacity-80">points</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-warning-foreground/20 rounded-xl px-3 py-2 mb-3">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">{rewards.streak} day streak</span>
            <span className="text-xs bg-warning-foreground/30 px-2 py-0.5 rounded-full ml-auto">2x points</span>
          </div>
          <button 
            onClick={() => onNavigate('rewards')} 
            className="w-full bg-card text-warning py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-card/90 transition-colors"
          >
            <Gift className="w-4 h-4" />
            View Rewards
          </button>
        </div>

        {/* Quick Action */}
        <div className="bg-gradient-primary rounded-3xl p-5 text-primary-foreground shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Need something done?</h3>
              <p className="text-primary-foreground/80 text-sm">Get instant quotes from verified pros</p>
            </div>
            <Zap className="w-8 h-8 text-warning animate-bounce-subtle" />
          </div>
          <button
            onClick={() => { onResetRequestForm(); onNavigate('post-request'); }}
            className="w-full bg-card text-primary py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-card/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Post a Job
          </button>
        </div>

        {/* Quick Re-hire */}
        {previousVendors.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Quick Re-hire</h3>
              <button onClick={() => onNavigate('previous-vendors')} className="text-sm font-semibold text-primary hover:underline">View All</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
              {previousVendors.slice(0, 3).map((vendor) => (
                <button
                  key={vendor.id}
                  onClick={() => { onSelectVendor(vendor); onNavigate('vendor-profile'); }}
                  className="flex-shrink-0 w-36 bg-card p-4 rounded-2xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative mb-3">
                    <div className="avatar-primary w-14 h-14 text-xl mx-auto group-hover:scale-110 transition-transform duration-300">
                      {vendor.avatar}
                    </div>
                    {vendor.favorite && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                        <Heart className="w-3 h-3 text-destructive-foreground fill-current" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-foreground text-sm mb-1 truncate text-center">{vendor.name}</h4>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-3 h-3 text-warning fill-warning" />
                    <span className="text-xs font-bold">{vendor.rating}</span>
                  </div>
                  <div className="w-full py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold text-center">Re-hire</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-bold text-foreground mb-4">Popular Services</h3>
          <div className="grid grid-cols-3 gap-3">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat.name}
                onClick={() => { onSelectCategory(cat.name); onResetRequestForm(); onNavigate('post-request'); }}
                className="bg-card p-4 rounded-2xl border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${cat.gradient} rounded-xl flex items-center justify-center text-xl mb-2 mx-auto shadow group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <div className="text-xs font-semibold text-foreground text-center">{cat.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Jobs */}
        {activeJobs.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Active Jobs</h3>
              <button onClick={() => onNavigate('transactions')} className="text-sm font-semibold text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {activeJobs.slice(0, 2).map((job) => (
                <button
                  key={job.id}
                  onClick={() => { onSelectJob(job); onNavigate('job-detail'); }}
                  className="card-interactive w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-foreground">{job.title}</h4>
                    <span className={`px-2.5 py-1 ${statusColors[job.status].bg} ${statusColors[job.status].text} text-xs font-bold rounded-full`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{job.vendor}</span>
                    <span className="font-bold text-foreground">{job.amount} AED</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav active="home" userType="consumer" onNavigate={onNavigate} />
    </div>
  );
};

export default ConsumerHomeScreen;
