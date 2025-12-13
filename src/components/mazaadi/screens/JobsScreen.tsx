import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, Timer, Star, ChevronRight, Briefcase } from 'lucide-react';
import { Job, ScreenType, UserType } from '@/types/mazaadi';
import { useState } from 'react';
import BottomNav from '../BottomNav';
import { CategoryIcon } from '../utils/categoryIcons';

interface JobsScreenProps {
  jobs: Job[];
  userType: UserType;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectJob: (job: Job) => void;
}

const JobsScreen = ({ jobs, userType, onBack, onNavigate, onSelectJob }: JobsScreenProps) => {
  const [activeTab, setActiveTab] = useState<'active' | 'previous'>('active');

  const tabs = [
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

  const displayedJobs = activeTab === 'active' ? activeJobs : previousJobs;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground p-6 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold">My Jobs</h1>
              <p className="opacity-60 text-sm">{jobs.length} total jobs</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
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
              onClick={() => setActiveTab(tab.key as 'active' | 'previous')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              <span className="ml-2 opacity-70">
                ({tab.key === 'active' ? activeJobs.length : previousJobs.length})
              </span>
            </button>
          ))}
        </motion.div>
      </div>

      {/* Jobs List */}
      <div className="p-4 space-y-3">
        {displayedJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {activeTab === 'active' ? 'No active jobs' : 'No previous jobs'}
            </p>
          </div>
        ) : (
          displayedJobs.map((job, index) => {
            const statusConfig = getStatusConfig(job.status);
            const StatusIcon = statusConfig.icon;
            
              const canReview = userType === 'consumer' && job.status === 'Completed' && !job.rated;
              
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.03 }}
                  whileHover={{ y: -2 }}
                  className="card-interactive p-4"
                >
                  <div className="flex items-start justify-between mb-3" onClick={() => onSelectJob(job)}>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <CategoryIcon category={job.category} className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {job.title}
                        </h3>
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
                      {job.offersCount && (
                        <span className="text-sm font-semibold text-foreground">
                          {job.offersCount} offers
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {job.amount > 0 && (
                        <span className="font-bold text-foreground">
                          {job.amount} AED
                        </span>
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

                  {/* Review CTA for completed unrated jobs */}
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
                      <span className="text-sm font-bold text-primary">
                        +{job.pointsEarned} pts
                      </span>
                    </div>
                  )}
                </motion.div>
              );
          })
        )}
      </div>

      <BottomNav active="transactions" userType={userType} onNavigate={onNavigate} />
    </div>
  );
};

export default JobsScreen;