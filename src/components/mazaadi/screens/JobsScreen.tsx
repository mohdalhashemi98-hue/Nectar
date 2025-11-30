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
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { key: 'all', label: 'All', color: 'from-violet-500 to-purple-600' },
    { key: 'pending', label: 'Pending', color: 'from-amber-500 to-orange-500' },
    { key: 'in-progress', label: 'Active', color: 'from-blue-500 to-cyan-500' },
    { key: 'completed', label: 'Done', color: 'from-emerald-500 to-green-500' }
  ];

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'AC & HVAC':
        return { icon: '❄️', gradient: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-500/10' };
      case 'Plumbing':
        return { icon: '🚿', gradient: 'from-blue-500 to-indigo-500', bg: 'bg-blue-500/10' };
      case 'Cleaning':
        return { icon: '✨', gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10' };
      case 'Maintenance':
        return { icon: '🔧', gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-500/10' };
      default:
        return { icon: '📦', gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10' };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Completed':
        return { 
          icon: CheckCircle, 
          color: 'text-emerald-500', 
          bg: 'bg-gradient-to-r from-emerald-500/20 to-green-500/20',
          border: 'border-emerald-500/30',
          glow: 'shadow-emerald-500/20'
        };
      case 'In Progress':
        return { 
          icon: Timer, 
          color: 'text-blue-500', 
          bg: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
          border: 'border-blue-500/30',
          glow: 'shadow-blue-500/20'
        };
      case 'Pending':
        return { 
          icon: Clock, 
          color: 'text-amber-500', 
          bg: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20',
          border: 'border-amber-500/30',
          glow: 'shadow-amber-500/20'
        };
      case 'Awaiting Completion':
        return { 
          icon: AlertCircle, 
          color: 'text-violet-500', 
          bg: 'bg-gradient-to-r from-violet-500/20 to-purple-500/20',
          border: 'border-violet-500/30',
          glow: 'shadow-violet-500/20'
        };
      default:
        return { 
          icon: Clock, 
          color: 'text-muted-foreground', 
          bg: 'bg-muted',
          border: 'border-border',
          glow: ''
        };
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'pending' && job.status === 'Pending') ||
      (activeFilter === 'in-progress' && (job.status === 'In Progress' || job.status === 'Awaiting Completion')) ||
      (activeFilter === 'completed' && job.status === 'Completed');
    
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const completedCount = jobs.filter(j => j.status === 'Completed').length;
  const activeCount = jobs.filter(j => j.status === 'In Progress' || j.status === 'Awaiting Completion').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-violet-950/5">
      {/* Header with decorative elements */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white p-6 pb-20 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-fuchsia-400/20 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-cyan-400/20 rounded-full blur-lg" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
                My Jobs
              </h1>
              <p className="text-white/70 text-sm">{jobs.length} total jobs</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold">{completedCount}</p>
                  <p className="text-[10px] text-white/70">Completed</p>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                  <Timer className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold">{activeCount}</p>
                  <p className="text-[10px] text-white/70">Active</p>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold">{jobs.reduce((acc, j) => acc + j.pointsEarned, 0)}</p>
                  <p className="text-[10px] text-white/70">Points</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters - Floating */}
      <div className="px-4 -mt-8 relative z-20">
        <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-border/50 flex gap-1">
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                activeFilter === filter.key
                  ? `bg-gradient-to-r ${filter.color} text-white shadow-lg`
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="p-4 space-y-3 pt-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-violet-500" />
            </div>
            <p className="text-muted-foreground">No jobs found</p>
          </div>
        ) : (
          filteredJobs.map((job, index) => {
            const statusConfig = getStatusConfig(job.status);
            const categoryConfig = getCategoryConfig(job.category);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className={`bg-card rounded-2xl p-4 border border-border hover:border-violet-500/30 transition-all cursor-pointer group animate-fade-in shadow-sm hover:shadow-lg ${statusConfig.glow}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryConfig.gradient} flex items-center justify-center text-xl shadow-lg`}>
                      {categoryConfig.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-violet-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{job.category}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.border} border flex items-center gap-1.5`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
                    <span className={`text-xs font-medium ${statusConfig.color}`}>{job.status}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {job.vendor && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                          {job.vendor.charAt(0)}
                        </div>
                        <span className="text-sm text-muted-foreground">{job.vendor}</span>
                      </div>
                    )}
                    {job.offersCount && (
                      <span className="text-sm bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent font-bold">
                        {job.offersCount} offers
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {job.amount > 0 && (
                      <span className="font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                        {job.amount} AED
                      </span>
                    )}
                    {job.rated && (
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-bold text-amber-600">{job.rating}</span>
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-violet-500 transition-colors" />
                  </div>
                </div>

                {job.pointsEarned > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <span className="text-xs">🪙</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Earned</span>
                    <span className="text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                      +{job.pointsEarned} pts
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JobsScreen;
