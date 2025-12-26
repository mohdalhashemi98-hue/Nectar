import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, Timer, Star, ChevronRight, Briefcase, Plus, MapPin, Calendar, Users, RefreshCw, ArrowLeft } from 'lucide-react';
import { Job, ScreenType, UserType } from '@/types/stack';
import { useState } from 'react';
import BottomNav from '../BottomNav';
import { CategoryIcon } from '../utils/categoryIcons';
import { useUpdateJobStatus } from '@/hooks/use-data-queries';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface JobsScreenProps {
  jobs: Job[];
  userType: UserType;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectJob: (job: Job) => void;
}

// Mock market jobs data
const marketJobs = [
  {
    id: 'm1',
    title: 'Kitchen Deep Cleaning',
    category: 'Cleaning',
    location: 'Dubai Marina',
    budget: '200-350 AED',
    postedTime: '2 hours ago',
    proposals: 5,
    description: 'Looking for professional kitchen deep cleaning service including appliances.'
  },
  {
    id: 'm2',
    title: 'AC Maintenance & Repair',
    category: 'AC Services',
    location: 'JBR',
    budget: '150-300 AED',
    postedTime: '4 hours ago',
    proposals: 8,
    description: 'Annual AC maintenance for 3 units. Cleaning and gas refill if needed.'
  },
  {
    id: 'm3',
    title: 'Furniture Assembly',
    category: 'Handyman',
    location: 'Downtown Dubai',
    budget: '100-200 AED',
    postedTime: '6 hours ago',
    proposals: 3,
    description: 'Need help assembling IKEA furniture - wardrobe and desk.'
  },
  {
    id: 'm4',
    title: 'Bathroom Plumbing Fix',
    category: 'Plumbing',
    location: 'Business Bay',
    budget: '250-400 AED',
    postedTime: '1 day ago',
    proposals: 12,
    description: 'Leaking faucet and slow drain in master bathroom.'
  },
  {
    id: 'm5',
    title: 'Home Painting - 2 Rooms',
    category: 'Painting',
    location: 'Al Barsha',
    budget: '800-1200 AED',
    postedTime: '1 day ago',
    proposals: 7,
    description: 'Repaint 2 bedrooms, walls and ceiling. Paint will be provided.'
  }
];

const JobsScreen = ({ jobs, userType, onBack, onNavigate, onSelectJob }: JobsScreenProps) => {
  const [activeTab, setActiveTab] = useState<'market' | 'active' | 'previous'>('market');
  const updateJobStatus = useUpdateJobStatus();

  const statusOptions = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

  const handleStatusChange = async (job: Job, newStatus: string) => {
    if (!job.uuid) {
      toast.error('Cannot update job: missing job ID');
      return;
    }

    try {
      await updateJobStatus.mutateAsync({ 
        jobId: job.uuid,
        status: newStatus 
      });
      toast.success(`Job status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update job status:', error);
      toast.error('Failed to update job status. Make sure you are logged in.');
    }
  };

  const tabs = [
    { key: 'market', label: 'Browse Market' },
    { key: 'active', label: 'Active' },
    { key: 'previous', label: 'Previous' }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Completed':
        return { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' };
      case 'In Progress':
        return { icon: Timer, color: 'text-foreground', bg: 'bg-foreground/10' };
      case 'Pending':
        return { icon: Clock, color: 'text-warning', bg: 'bg-warning/10' };
      case 'Awaiting Completion':
        return { icon: AlertCircle, color: 'text-muted-foreground', bg: 'bg-muted' };
      default:
        return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' };
    }
  };

  const activeJobs = jobs.filter(job => 
    job.status === 'Pending' || job.status === 'In Progress' || job.status === 'Awaiting Completion'
  );
  
  const previousJobs = jobs.filter(job => job.status === 'Completed');

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground px-4 py-6 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <button onClick={onBack} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold">Jobs</h1>
              <p className="opacity-60 text-sm">Find services or track your requests</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('post-request')}
              className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/95 backdrop-blur-xl rounded-2xl p-1.5 border border-border flex gap-1"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'market' | 'active' | 'previous')}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Market Jobs */}
      {activeTab === 'market' && (
        <div className="p-4 space-y-3">
          {/* Post Job CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Need a service?</h3>
                <p className="text-sm text-muted-foreground">Post a job and get offers from pros</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('post-request')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold"
              >
                Post Job
              </motion.button>
            </div>
          </motion.div>

          <h2 className="font-semibold text-foreground mb-3">Open Jobs in Market</h2>
          
          {marketJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.03 }}
              whileHover={{ y: -2 }}
              className="card-interactive p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <CategoryIcon category={job.category} className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.category}</p>
                </div>
                <span className="text-sm font-bold text-primary">{job.budget}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{job.postedTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{job.proposals} proposals</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Active Jobs */}
      {activeTab === 'active' && (
        <div className="p-4 space-y-3">
          {activeJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No active jobs</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('post-request')}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold"
              >
                Post Your First Job
              </motion.button>
            </div>
          ) : (
            activeJobs.map((job, index) => {
              const statusConfig = getStatusConfig(job.status);
              const StatusIcon = statusConfig.icon;
              const hasPendingOffers = job.status === 'Pending' && job.offersCount && job.offersCount > 0;
              
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.03 }}
                  whileHover={{ y: -2 }}
                  className="card-interactive p-4"
                  onClick={() => {
                    onSelectJob(job);
                    // Navigate to quote management if pending with offers
                    if (hasPendingOffers) {
                      onNavigate('quote-management');
                    } else {
                      onNavigate('job-detail');
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <CategoryIcon category={job.category} className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.category}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger 
                        onClick={(e) => e.stopPropagation()}
                        className={`px-3 py-1.5 rounded-full ${statusConfig.bg} flex items-center gap-1.5 hover:ring-2 hover:ring-primary/20 transition-all`}
                      >
                        <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
                        <span className={`text-xs font-medium ${statusConfig.color}`}>{job.status}</span>
                        <RefreshCw className={`w-3 h-3 ${statusConfig.color} ${updateJobStatus.isPending ? 'animate-spin' : ''}`} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        {statusOptions.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(job, status)}
                            disabled={job.status === status}
                            className={job.status === status ? 'bg-primary/10' : ''}
                          >
                            {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {job.vendor && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                            {job.vendor.charAt(0)}
                          </div>
                          <span className="text-sm text-muted-foreground">{job.vendor}</span>
                        </div>
                      )}
                      {hasPendingOffers && (
                        <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                          {job.offersCount} offers - Compare
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {job.amount > 0 && (
                        <span className="font-bold text-foreground">{job.amount} AED</span>
                      )}
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* Previous Jobs */}
      {activeTab === 'previous' && (
        <div className="p-4 space-y-3">
          {previousJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No previous jobs</p>
            </div>
          ) : (
            previousJobs.map((job, index) => {
              const statusConfig = getStatusConfig(job.status);
              const StatusIcon = statusConfig.icon;
              const canReview = userType === 'consumer' && job.status === 'Completed' && !job.rated;
              
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.03 }}
                  whileHover={{ y: -2 }}
                  className="card-interactive p-4"
                >
                  <div className="flex items-start justify-between mb-3" onClick={() => onSelectJob(job)}>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <CategoryIcon category={job.category} className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.category}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full ${statusConfig.bg} flex items-center gap-1.5`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
                      <span className={`text-xs font-medium ${statusConfig.color}`}>{job.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between" onClick={() => onSelectJob(job)}>
                    <div className="flex items-center gap-4">
                      {job.vendor && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                            {job.vendor.charAt(0)}
                          </div>
                          <span className="text-sm text-muted-foreground">{job.vendor}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {job.amount > 0 && (
                        <span className="font-bold text-foreground">{job.amount} AED</span>
                      )}
                      {job.rated && (
                        <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                          <Star className="w-4 h-4 text-primary fill-primary" />
                          <span className="text-sm font-bold">{job.rating}</span>
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>

                  {canReview && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 pt-3 border-t border-border"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectJob(job);
                          onNavigate('review');
                        }}
                        className="w-full py-2.5 bg-gradient-golden text-primary-foreground rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <Star className="w-4 h-4" />
                        Leave a Review & Earn 50 pts
                      </button>
                    </motion.div>
                  )}

                  {job.pointsEarned > 0 && !canReview && (
                    <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs">🪙</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Earned</span>
                      <span className="text-sm font-bold text-primary">+{job.pointsEarned} pts</span>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      )}

      <BottomNav active="transactions" userType={userType} onNavigate={onNavigate} />
    </div>
  );
};

export default JobsScreen;