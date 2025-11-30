import { ArrowLeft, Clock, CheckCircle, AlertCircle, Timer, Star, ChevronRight, Filter, Search } from 'lucide-react';
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
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'in-progress', label: 'Active' },
    { key: 'completed', label: 'Completed' }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Completed':
        return { 
          icon: CheckCircle, 
          color: 'text-emerald-500', 
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20'
        };
      case 'In Progress':
        return { 
          icon: Timer, 
          color: 'text-mazaadi-primary', 
          bg: 'bg-mazaadi-primary/10',
          border: 'border-mazaadi-primary/20'
        };
      case 'Pending':
        return { 
          icon: Clock, 
          color: 'text-amber-500', 
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20'
        };
      case 'Awaiting Completion':
        return { 
          icon: AlertCircle, 
          color: 'text-blue-500', 
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20'
        };
      default:
        return { 
          icon: Clock, 
          color: 'text-muted-foreground', 
          bg: 'bg-muted',
          border: 'border-border'
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-mazaadi text-white p-6 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">My Jobs</h1>
            <p className="text-white/80 text-sm">{jobs.length} total jobs</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/20 backdrop-blur-sm text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:border-white/40 transition-colors"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 -mt-4">
        <div className="bg-card rounded-2xl p-2 shadow-lg border border-border flex gap-1">
          {filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                activeFilter === filter.key
                  ? 'bg-mazaadi-primary text-white shadow-md'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="p-4 space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No jobs found</p>
          </div>
        ) : (
          filteredJobs.map((job, index) => {
            const statusConfig = getStatusConfig(job.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="bg-card rounded-2xl p-4 border border-border hover:border-mazaadi-primary/30 transition-all cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{job.category === 'AC & HVAC' ? '❄️' : job.category === 'Plumbing' ? '🚿' : job.category === 'Cleaning' ? '✨' : '🔧'}</span>
                      <h3 className="font-semibold text-foreground group-hover:text-mazaadi-primary transition-colors">
                        {job.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.category}</p>
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
                        <div className="w-8 h-8 rounded-full bg-gradient-mazaadi flex items-center justify-center text-white text-xs font-bold">
                          {job.vendor.charAt(0)}
                        </div>
                        <span className="text-sm text-muted-foreground">{job.vendor}</span>
                      </div>
                    )}
                    {job.offersCount && (
                      <span className="text-sm text-mazaadi-primary font-medium">
                        {job.offersCount} offers
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {job.amount > 0 && (
                      <span className="font-bold text-foreground">{job.amount} AED</span>
                    )}
                    {job.rated && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-medium">{job.rating}</span>
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-mazaadi-primary transition-colors" />
                  </div>
                </div>

                {job.pointsEarned > 0 && (
                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                    <span className="text-amber-500">🪙</span>
                    <span className="text-sm text-muted-foreground">Earned</span>
                    <span className="text-sm font-bold text-amber-500">+{job.pointsEarned} pts</span>
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
