import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Plus, Star, Heart, ChevronRight, Sparkles, X, HelpCircle, CheckCircle2, MapPin, Filter, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Rewards, Vendor, Job, Notification, ScreenType } from '@/types/stack';
import { tierConfig, categories } from '@/data/stack-data';
import { ConsumerHomeSkeleton } from '../ScreenSkeleton';
import { CategoryIcon, getCategoryIcon } from '../utils/categoryIcons';
import { ThemeToggle } from '@/components/theme-toggle';
import StackLogo from '@/components/StackLogo';
import BottomNav from '../BottomNav';
import PullToRefresh from '../PullToRefresh';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { ConsumerRefreshSkeleton } from '../RefreshSkeleton';
import { StackPatternCorner } from '../StackPattern';

interface ConsumerHomeScreenProps {
  userProfile: { name: string };
  rewards: Rewards;
  previousVendors: Vendor[];
  recommendedVendors: Vendor[];
  jobs: Job[];
  notifications: Notification[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigate: (screen: ScreenType, params?: { id?: string | number }) => void;
  onSelectCategory: (category: string) => void;
  onSelectVendor: (vendor: Vendor) => void;
  onSelectJob: (job: Job) => void;
  onResetRequestForm: () => void;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  'Completed': { bg: 'bg-primary/10', text: 'text-primary' },
  'In Progress': { bg: 'bg-primary/10', text: 'text-primary' },
  'Pending': { bg: 'bg-warning/10', text: 'text-warning' },
  'Awaiting Completion': { bg: 'bg-muted', text: 'text-muted-foreground' },
  'Cancelled': { bg: 'bg-destructive/10', text: 'text-destructive' }
};

const ConsumerHomeScreen = ({
  userProfile,
  rewards,
  previousVendors,
  recommendedVendors,
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
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewBanner, setShowReviewBanner] = useState(true);
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'distance'>('rating');

  // Get unique specialties from vendors
  const specialties = Array.from(new Set(recommendedVendors.map(v => v.specialty).filter(Boolean)));

  // Filter vendors based on selected filters
  const filteredVendors = recommendedVendors.filter(vendor => {
    const matchesSpecialty = specialtyFilter === 'all' || vendor.specialty === specialtyFilter;
    const matchesRating = vendor.rating >= ratingFilter;
    return matchesSpecialty && matchesRating;
  });

  // Sort filtered vendors
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviews - a.reviews;
      case 'distance':
        // Parse distance strings like "2.3 km" to numbers
        const distA = parseFloat(a.distance?.replace(/[^\d.]/g, '') || '999');
        const distB = parseFloat(b.distance?.replace(/[^\d.]/g, '') || '999');
        return distA - distB;
      default:
        return 0;
    }
  });

  const handleRefresh = useCallback(async () => {
    // Simulate refresh - in a real app this would refetch data
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, []);

  const { pullDistance, isRefreshing, isPulling, handlers, containerRef } = usePullToRefresh({
    onRefresh: handleRefresh
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const pendingReviewJobs = jobs.filter(j => j.status === 'Completed' && !j.rated);

  const searchResults = searchQuery.length > 0
    ? categories.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
    : [];

  const activeJobs = jobs.filter(j => j.status === 'In Progress' || j.status === 'Awaiting Completion');

  if (isLoading) {
    return <ConsumerHomeSkeleton />;
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="px-4 py-5">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-5"
          >
            <div className="flex items-center gap-3">
              <StackLogo size={40} />
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground mb-0.5">
                  Hi, {userProfile.name.split(' ')[0]}
                </h1>
                <p className="text-sm text-muted-foreground">What can we help with today?</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button 
                onClick={() => onNavigate('help')} 
                className="p-3 bg-secondary rounded-3xl hover:bg-secondary/80 transition-colors"
              >
                <HelpCircle className="w-5 h-5 text-foreground" />
              </button>
              <button 
                onClick={() => onNavigate('notifications')} 
                className="relative p-3 bg-secondary rounded-3xl hover:bg-secondary/80 transition-colors"
              >
                <Bell className="w-5 h-5 text-foreground" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
            </div>
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
              className="mt-3 bg-card rounded-3xl border border-border overflow-hidden"
              style={{ boxShadow: 'var(--shadow-lg)' }}
            >
              {searchResults.length > 0 ? (
                searchResults.map((cat) => {
                  const IconComponent = getCategoryIcon(cat.name);
                  return (
                    <button
                      key={cat.name}
                      onClick={() => {
                        onSelectCategory(cat.name);
                        setSearchQuery('');
                        onNavigate('services');
                      }}
                      className="w-full p-4 flex items-center gap-3 hover:bg-secondary/50 border-b border-border last:border-0 transition-colors"
                    >
                      <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-foreground" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-foreground">{cat.name}</div>
                        <div className="text-xs text-muted-foreground">{cat.description}</div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-muted-foreground">No services found</div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <PullToRefresh
        ref={containerRef}
        pullDistance={pullDistance}
        isRefreshing={isRefreshing}
        isPulling={isPulling}
        handlers={handlers}
        className="flex-1"
        refreshSkeleton={<ConsumerRefreshSkeleton />}
      >
        <div className="px-4 py-5 pb-24 space-y-6">
        {/* Review Reminder Banner */}
        <AnimatePresence>
          {showReviewBanner && pendingReviewJobs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 border border-primary/30 rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
                <button 
                  onClick={() => setShowReviewBanner(false)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">
                      {pendingReviewJobs.length === 1 
                        ? `Review your ${pendingReviewJobs[0].title}` 
                        : `${pendingReviewJobs.length} jobs need your review`}
                    </p>
                    <p className="text-xs text-muted-foreground">Earn 50 points per review</p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectJob(pendingReviewJobs[0]);
                      onNavigate('review');
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary/90 transition-colors flex-shrink-0"
                  >
                    Review
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Golden Ticket Rewards Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-golden p-5 relative overflow-hidden"
        >
          {/* Decorative stack pattern */}
          <StackPatternCorner className="absolute top-0 right-0 w-32 h-32 opacity-20" />
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-3xl flex items-center justify-center">
                <span className="text-2xl">{tierConfig[rewards.tier].icon}</span>
              </div>
              <div>
                <div className="font-display font-bold text-lg">{rewards.tier} Member</div>
                <div className="text-sm opacity-80">{rewards.cashbackRate}% cashback</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-2xl font-bold">{rewards.points.toLocaleString()}</div>
              <div className="text-xs opacity-80">points</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-primary-foreground/20 rounded-2xl px-3 py-2 mb-4 relative z-10">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">12 jobs completed</span>
            <span className="text-xs bg-primary-foreground/30 px-2 py-0.5 rounded-full ml-auto">Top 10%</span>
          </div>
          <button 
            onClick={() => onNavigate('rewards')} 
            className="w-full bg-primary-foreground text-primary py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary-foreground/90 transition-colors relative z-10"
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
            onClick={() => { onResetRequestForm(); onNavigate('services'); }}
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
              <button onClick={() => onNavigate('previous-vendors')} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                View All
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
              {previousVendors.slice(0, 3).map((vendor) => (
                <motion.button
                  key={vendor.id}
                  whileHover={{ y: -4 }}
                  onClick={() => { onSelectVendor(vendor); onNavigate('vendor-profile', { id: vendor.id }); }}
                  className="flex-shrink-0 w-32 bg-card p-4 rounded-3xl border border-border transition-all duration-300 group"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <div className="relative mb-3">
                    <div className="avatar-primary w-12 h-12 text-lg mx-auto">
                      {vendor.avatar}
                    </div>
                    {vendor.favorite && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Heart className="w-3 h-3 text-primary-foreground fill-current" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1 truncate text-center">{vendor.name}</h4>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                    <span className="text-xs font-bold">{vendor.rating}</span>
                  </div>
                  <div className="w-full py-2 bg-secondary text-foreground rounded-xl text-xs font-semibold text-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold text-foreground">Popular Services</h3>
            <button 
              onClick={() => onNavigate('services')} 
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {categories.slice(0, 6).map((cat) => {
              const IconComponent = getCategoryIcon(cat.name);
              return (
                <motion.button
                  key={cat.name}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { onSelectCategory(cat.name); onResetRequestForm(); onNavigate('services'); }}
                  className="bg-card p-4 rounded-3xl border border-border hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 mx-auto bg-gradient-to-br ${cat.gradient} text-white`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-medium text-foreground text-center truncate">{cat.name}</div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Recommended Pros */}
        {recommendedVendors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-foreground">Recommended Pros</h3>
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${showFilters ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            {/* Filter Controls */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="bg-secondary/50 rounded-2xl p-4 space-y-4">
                    {/* Specialty Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Specialty</label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSpecialtyFilter('all')}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            specialtyFilter === 'all' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-card border border-border text-foreground hover:border-primary/50'
                          }`}
                        >
                          All
                        </button>
                        {specialties.map((specialty) => (
                          <button
                            key={specialty}
                            onClick={() => setSpecialtyFilter(specialty)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              specialtyFilter === specialty 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-card border border-border text-foreground hover:border-primary/50'
                            }`}
                          >
                            {specialty}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Minimum Rating</label>
                      <div className="flex gap-2">
                        {[0, 4, 4.5, 4.8].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setRatingFilter(rating)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              ratingFilter === rating 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-card border border-border text-foreground hover:border-primary/50'
                            }`}
                          >
                            {rating === 0 ? 'Any' : (
                              <>
                                <Star className="w-3 h-3 fill-current" />
                                {rating}+
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
                      <div className="flex gap-2">
                        {([
                          { value: 'rating', label: 'Rating', icon: Star },
                          { value: 'reviews', label: 'Reviews', icon: Star },
                          { value: 'distance', label: 'Nearest', icon: MapPin },
                        ] as const).map(({ value, label, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => setSortBy(value)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              sortBy === value 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-card border border-border text-foreground hover:border-primary/50'
                            }`}
                          >
                            <Icon className="w-3 h-3" />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Filters Summary */}
                    {(specialtyFilter !== 'all' || ratingFilter > 0) && (
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-sm text-muted-foreground">
                          {sortedVendors.length} {sortedVendors.length === 1 ? 'pro' : 'pros'} found
                        </span>
                        <button 
                          onClick={() => { setSpecialtyFilter('all'); setRatingFilter(0); }}
                          className="text-sm font-medium text-primary hover:text-primary/80"
                        >
                          Clear Filters
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Vendor List */}
            <div className="space-y-3">
              {sortedVendors.length > 0 ? (
                sortedVendors.slice(0, 6).map((vendor) => (
                  <motion.button
                    key={vendor.id}
                    whileHover={{ y: -2 }}
                    onClick={() => { onSelectVendor(vendor); onNavigate('vendor-profile', { id: vendor.id }); }}
                    className="card-interactive w-full p-4 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="avatar-primary w-14 h-14 text-lg">
                          {vendor.avatar || vendor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        {vendor.verified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground truncate">{vendor.name}</h4>
                          {vendor.verified && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full whitespace-nowrap">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{vendor.specialty}</p>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-primary fill-primary" />
                            <span className="font-semibold">{vendor.rating}</span>
                            <span className="text-muted-foreground">({vendor.reviews})</span>
                          </div>
                          {vendor.distance && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{vendor.distance}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </motion.button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No pros match your filters</p>
                  <button 
                    onClick={() => { setSpecialtyFilter('all'); setRatingFilter(0); }}
                    className="text-sm font-medium text-primary hover:text-primary/80 mt-2"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-foreground">Active Jobs</h3>
              <button onClick={() => onNavigate('transactions')} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
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
                    <span className="font-bold text-primary">{job.amount} AED</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        </div>
      </PullToRefresh>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { onResetRequestForm(); onNavigate('services'); }}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-golden text-primary-foreground rounded-full flex items-center justify-center z-40"
        style={{ boxShadow: 'var(--shadow-golden)' }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      <BottomNav 
        active="home" 
        userType="consumer" 
        onNavigate={onNavigate} 
        pendingQuotes={jobs.filter(j => j.status === 'Pending' && j.offersCount && j.offersCount > 0).length}
        unreadMessages={2}
      />
    </div>
  );
};

export default ConsumerHomeScreen;