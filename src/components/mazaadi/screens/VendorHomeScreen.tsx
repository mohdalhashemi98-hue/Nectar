import { Star, Settings, DollarSign, Briefcase, MapPin, Clock, ChevronRight, Zap } from 'lucide-react';
import { VendorStats, AvailableJob, ScreenType } from '@/types/mazaadi';
import BottomNav from '../BottomNav';

interface VendorHomeScreenProps {
  vendorStats: VendorStats;
  availableJobs: AvailableJob[];
  onNavigate: (screen: ScreenType) => void;
  onSelectJob: (job: AvailableJob) => void;
}

const VendorHomeScreen = ({
  vendorStats,
  availableJobs,
  onNavigate,
  onSelectJob
}: VendorHomeScreenProps) => (
  <div className="flex flex-col h-screen bg-background">
    {/* Header */}
    <div className="bg-gradient-primary text-primary-foreground">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-5 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold mb-1">Ahmad Al-Mansouri</h1>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-bold">{vendorStats.rating}</span>
              <span className="text-primary-foreground/70">({vendorStats.reviews} reviews)</span>
            </div>
          </div>
          <button onClick={() => onNavigate('profile')} className="p-3 bg-primary-foreground/20 rounded-2xl hover:bg-primary-foreground/30 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {[
            { value: vendorStats.totalJobs, label: 'Jobs Done' },
            { value: `${(vendorStats.totalEarnings / 1000).toFixed(0)}K`, label: 'AED Earned' },
            { value: `${vendorStats.completionRate}%`, label: 'Success' }
          ].map((stat, idx) => (
            <div key={idx} className="glass-dark rounded-2xl p-3 text-center">
              <div className="text-2xl font-extrabold">{stat.value}</div>
              <div className="text-xs text-primary-foreground/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 overflow-y-auto px-6 py-5 pb-24 space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 animate-fade-in">
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div className="text-xs text-muted-foreground">This Month</div>
          </div>
          <div className="text-xl font-extrabold text-foreground">{vendorStats.thisMonth.earnings.toLocaleString()} AED</div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div className="text-xs text-muted-foreground">This Month</div>
          </div>
          <div className="text-xl font-extrabold text-foreground">{vendorStats.thisMonth.jobs} Jobs</div>
        </div>
      </div>

      {/* Available Jobs */}
      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Available Jobs</h3>
          <span className="badge-danger">{availableJobs.length} new</span>
        </div>
        <div className="space-y-3">
          {availableJobs.map((job, idx) => (
            <button
              key={job.id}
              onClick={() => { onSelectJob(job); onNavigate('request-detail'); }}
              className="card-interactive w-full p-4 text-left animate-fade-in"
              style={{ animationDelay: `${0.1 * idx}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-foreground">{job.title}</h4>
                    {job.urgent && (
                      <span className="badge-danger flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{job.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{job.budget}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.distance}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.time}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>

    <BottomNav active="home" userType="vendor" onNavigate={onNavigate} />
  </div>
);

export default VendorHomeScreen;
