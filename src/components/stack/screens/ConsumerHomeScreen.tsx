import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Plus, Star, Heart, ChevronRight, X, HelpCircle, CheckCircle2, MapPin, Filter, ChevronDown } from 'lucide-react';
import { Rewards, Vendor, Job, Notification, ScreenType } from '@/types/stack';
import { tierConfig, categories } from '@/data/stack-data';
import { ConsumerHomeSkeleton } from '../ScreenSkeleton';
import { CategoryIcon, getCategoryIcon } from '../utils/categoryIcons';
import { ThemeToggle } from '@/components/theme-toggle';
import BottomNav from '../BottomNav';
import PullToRefresh from '../PullToRefresh';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { ConsumerRefreshSkeleton } from '../RefreshSkeleton';

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
  onToggleFavorite?: (vendor: Vendor) => void;
  favoriteIds?: Set<string>;
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
  onResetRequestForm,
  onToggleFavorite,
  favoriteIds = new Set(),
}: ConsumerHomeScreenProps) => {
  const [showReviewBanner, setShowReviewBanner] = useState(true);
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'distance'>('rating');

  const specialties = Array.from(new Set(recommendedVendors.map(v => v.specialty).filter(Boolean)));

  const filteredVendors = recommendedVendors.filter(vendor => {
    const matchesSpecialty = specialtyFilter === 'all' || vendor.specialty === specialtyFilter;
    const matchesRating = vendor.rating >= ratingFilter;
    return matchesSpecialty && matchesRating;
  });

  const sortedVendors = [...filteredVendors].sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating;
      case 'reviews': return b.reviews - a.reviews;
      case 'distance':
        const distA = parseFloat(a.distance?.replace(/[^\d.]/g, '') || '999');
        const distB = parseFloat(b.distance?.replace(/[^\d.]/g, '') || '999');
        return distA - distB;
      default: return 0;
    }
  });

  const handleRefresh = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, []);

  const { pullDistance, isRefreshing, isPulling, handlers, containerRef } = usePullToRefresh({
    onRefresh: handleRefresh
  });

  const isLoading = false;
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
    <div className="w-full bg-background pb-24">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Hi, {userProfile.name.split(' ')[0]}
              </h1>
              <p className="text-sm text-muted-foreground">What can we help with?</p>
            </div>
            <div className="flex items-center gap-1.5">
              <ThemeToggle />
              <button onClick={() => onNavigate('help')} className="p-2.5 rounded-xl hover:bg-secondary transition-colors">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
              </button>
              <button onClick={() => onNavigate('notifications')} className="relative p-2.5 rounded-xl hover:bg-secondary transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-modern pl-10 py-2.5 text-sm"
            />
          </div>

          {/* Search Results */}
          {searchQuery.length > 0 && (
            <div className="mt-2 bg-card rounded-xl border border-border overflow-hidden">
              {searchResults.length > 0 ? (
                searchResults.map((cat) => {
                  const IconComponent = getCategoryIcon(cat.name);
                  return (
                    <button
                      key={cat.name}
                      onClick={() => { onSelectCategory(cat.name); setSearchQuery(''); onNavigate('services'); }}
                      className="w-full p-3 flex items-center gap-3 hover:bg-secondary/50 border-b border-border last:border-0 transition-colors"
                    >
                      <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-foreground" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-foreground text-sm">{cat.name}</div>
                        <div className="text-xs text-muted-foreground">{cat.description}</div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-muted-foreground text-sm">No services found</div>
              )}
            </div>
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
          {/* Review Banner */}
          <AnimatePresence>
            {showReviewBanner && pendingReviewJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 relative">
                  <button onClick={() => setShowReviewBanner(false)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-secondary">
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">
                        {pendingReviewJobs.length === 1
                          ? `Review your ${pendingReviewJobs[0].title}`
                          : `${pendingReviewJobs.length} jobs need review`}
                      </p>
                      <p className="text-xs text-muted-foreground">Earn 50 points per review</p>
                    </div>
                    <button
                      onClick={() => { onSelectJob(pendingReviewJobs[0]); onNavigate('review'); }}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold flex-shrink-0"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Post a Job */}
          <div className="card-elevated p-4">
            <h3 className="font-display text-lg font-bold text-foreground mb-1">Need something done?</h3>
            <p className="text-muted-foreground text-sm mb-4">Get instant quotes from verified pros</p>
            <button
              onClick={() => { onResetRequestForm(); onNavigate('services'); }}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Post a Job
            </button>
          </div>

          {/* Quick Re-hire */}
          {previousVendors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-base font-bold text-foreground">Quick Re-hire</h3>
                <button onClick={() => onNavigate('previous-vendors')} className="text-sm text-primary">View All</button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {previousVendors.slice(0, 3).map((vendor) => (
                  <button
                    key={vendor.id}
                    onClick={() => { onSelectVendor(vendor); onNavigate('vendor-profile', { id: vendor.id }); }}
                    className="flex-shrink-0 w-28 bg-card p-3 rounded-xl border border-border text-center"
                  >
                    <div className="avatar-primary w-11 h-11 text-sm mx-auto mb-2">{vendor.avatar}</div>
                    <h4 className="font-medium text-foreground text-xs truncate">{vendor.name}</h4>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber fill-amber" />
                      <span className="text-xs font-medium">{vendor.rating}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-bold text-foreground">Services</h3>
              <button onClick={() => onNavigate('services')} className="text-sm text-primary">View All</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {categories.slice(0, 6).map((cat) => {
                const IconComponent = getCategoryIcon(cat.name);
                return (
                  <button
                    key={cat.name}
                    onClick={() => { onSelectCategory(cat.name); onResetRequestForm(); onNavigate('services'); }}
                    className="bg-card p-3 rounded-xl border border-border hover:border-primary/20 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2 mx-auto bg-secondary">
                      <IconComponent className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="text-xs font-medium text-foreground text-center truncate">{cat.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommended Pros */}
          {recommendedVendors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-base font-bold text-foreground">Recommended Pros</h3>
                <button onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1 text-sm ${showFilters ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Filter className="w-4 h-4" /> Filter
                </button>
              </div>

              {/* Filter Controls */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-3">
                    <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block">Specialty</label>
                        <div className="flex flex-wrap gap-1.5">
                          <button onClick={() => setSpecialtyFilter('all')}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${specialtyFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>
                            All
                          </button>
                          {specialties.map((s) => (
                            <button key={s} onClick={() => setSpecialtyFilter(s)}
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${specialtyFilter === s ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-foreground mb-1.5 block">Min Rating</label>
                        <div className="flex gap-1.5">
                          {[0, 4, 4.5, 4.8].map((r) => (
                            <button key={r} onClick={() => setRatingFilter(r)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${ratingFilter === r ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>
                              {r === 0 ? 'Any' : <><Star className="w-3 h-3 fill-current" />{r}+</>}
                            </button>
                          ))}
                        </div>
                      </div>
                      {(specialtyFilter !== 'all' || ratingFilter > 0) && (
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="text-xs text-muted-foreground">{sortedVendors.length} found</span>
                          <button onClick={() => { setSpecialtyFilter('all'); setRatingFilter(0); }} className="text-xs text-primary">Clear</button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Vendor Cards */}
              <div className="-mx-4">
                {sortedVendors.length > 0 ? (
                  <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
                    {sortedVendors.slice(0, 8).map((vendor) => (
                      <button
                        key={vendor.id}
                        onClick={() => { onSelectVendor(vendor); onNavigate('vendor-profile', { id: vendor.id }); }}
                        className="flex-shrink-0 w-40 bg-card border border-border rounded-xl p-3 text-left"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="relative mb-2">
                            <div className="avatar-primary w-14 h-14 text-base">
                              {vendor.avatar || vendor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            {vendor.verified && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-2.5 h-2.5 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                          <h4 className="font-medium text-foreground text-sm truncate w-full">{vendor.name}</h4>
                          <p className="text-xs text-muted-foreground mb-1.5 truncate w-full">{vendor.specialty}</p>
                          <div className="flex items-center gap-1 text-sm mb-1">
                            <Star className="w-3 h-3 text-amber fill-amber" />
                            <span className="font-medium text-foreground text-xs">{vendor.rating}</span>
                            <span className="text-muted-foreground text-xs">({vendor.reviews})</span>
                          </div>
                          {vendor.distance && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />{vendor.distance}
                            </div>
                          )}
                          {onToggleFavorite && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onToggleFavorite(vendor); }}
                              className={`mt-1.5 p-1 rounded-full ${
                                favoriteIds.has(String(vendor.id)) ? 'text-destructive' : 'text-muted-foreground'
                              }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${favoriteIds.has(String(vendor.id)) ? 'fill-current' : ''}`} />
                            </button>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground px-4">
                    <p className="text-sm">No pros match your filters</p>
                    <button onClick={() => { setSpecialtyFilter('all'); setRatingFilter(0); }} className="text-sm text-primary mt-1">Clear Filters</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Jobs */}
          {activeJobs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-base font-bold text-foreground">Active Jobs</h3>
                <button onClick={() => onNavigate('transactions')} className="text-sm text-primary">View All</button>
              </div>
              <div className="space-y-2">
                {activeJobs.slice(0, 2).map((job) => (
                  <button
                    key={job.id}
                    onClick={() => { onSelectJob(job); onNavigate('job-detail'); }}
                    className="card-interactive w-full p-3 text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground text-sm">{job.title}</h4>
                      <span className={`px-2 py-0.5 ${statusColors[job.status].bg} ${statusColors[job.status].text} text-xs font-medium rounded-full`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{job.vendor}</span>
                      <span className="font-semibold text-primary text-sm">{job.amount} AED</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </PullToRefresh>

      {/* FAB */}
      <button
        onClick={() => { onResetRequestForm(); onNavigate('services'); }}
        className="fixed bottom-24 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center z-40 shadow-md"
      >
        <Plus className="w-5 h-5" />
      </button>

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
