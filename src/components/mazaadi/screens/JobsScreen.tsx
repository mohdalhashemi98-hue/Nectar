import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Timer, Star, ChevronRight, Briefcase, Sparkles } from 'lucide-react';
import { Job, ScreenType } from '@/types/mazaadi';
import { useState } from 'react';

interface JobsScreenProps {
  jobs: Job[];
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectJob: (job: Job) => void;
}

const JobsScreen = ({ jobs, onBack, onNavigate, onSelectJob }: JobsScreenProps) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'in-progress', label: 'Active' },
    { key: 'completed', label: 'Done' }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AC & HVAC': return '❄️';
      case 'Plumbing': return '🚿';
      case 'Cleaning': return '✨';
      case 'Maintenance': return '🔧';
      default: return '📦';
    }
  };

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

  const filteredJobs = jobs.filter(job => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return job.status === 'Pending';
    if (activeFilter === 'in-progress') return job.status === 'In Progress' || job.status === 'Awaiting Completion';
    if (activeFilter === 'completed') return job.status === 'Completed';
    return true;
  });

  const completedCount = jobs.filter(j => j.status === 'Completed').length;
  const activeCount = jobs.filter(j => j.status === 'In Progress' || j.status === 'Awaiting Completion').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background p-6 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-background/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-background/5 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold">My Jobs</h1>
              <p className="opacity-60 text-sm">{jobs.length} total jobs</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-background/10 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3"
          >
            {[
              { icon: CheckCircle, value: completedCount, label: 'Completed' },
              { icon: Timer, value: activeCount, label: 'Active' },
              { icon: Sparkles, value: jobs.reduce((acc, j) => acc + j.pointsEarned, 0), label: 'Points' }
            ].map((stat, idx) => (
              <div key={idx} className="flex-1 bg-background/10 rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-background/10 flex items-center justify-center">
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold">{stat.value}</p>
                    <p className="text-[10px] opacity-60">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Filters - Floating */}
      <div className="px-4 -mt-8 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card/95 backdrop-blur-xl rounded-2xl p-1.5 border border-border flex gap-1"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                activeFilter === filter.key
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Jobs List */}
      <div className="p-4 space-y-3 pt-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No jobs found</p>
          </div>
        ) : (
          filteredJobs.map((job, index) => {
            const statusConfig = getStatusConfig(job.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.03 }}
                whileHover={{ y: -2 }}
                onClick={() => onSelectJob(job)}
                className="card-interactive p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl">
                      {getCategoryIcon(job.category)}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {job.vendor && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold">
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
                      <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-foreground fill-foreground" />
                        <span className="text-sm font-bold">{job.rating}</span>
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                {job.pointsEarned > 0 && (
                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
                      <span className="text-xs">🪙</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Earned</span>
                    <span className="text-sm font-bold text-foreground">
                      +{job.pointsEarned} pts
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JobsScreen;