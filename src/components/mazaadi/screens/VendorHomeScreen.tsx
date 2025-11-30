import { Star, Settings, DollarSign, Briefcase, MapPin, Clock, ChevronRight, Zap, TrendingUp, Users, Calendar, Target, Award, BarChart3 } from 'lucide-react';
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
    <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-fuchsia-400/20 rounded-full blur-2xl" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-cyan-400/10 rounded-full blur-xl" />
      
      <div className="px-6 py-5 relative z-10">
        <div className="flex items-center justify-between mb-5 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-white via-fuchsia-200 to-white bg-clip-text text-transparent">Ahmad Al-Mansouri</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-500/30 px-2 py-0.5 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-amber-300">{vendorStats.rating}</span>
              </div>
              <span className="text-white/70">({vendorStats.reviews} reviews)</span>
            </div>
          </div>
          <button onClick={() => onNavigate('profile')} className="p-3 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors backdrop-blur-sm">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {[
            { value: vendorStats.totalJobs, label: 'Jobs Done', gradient: 'from-emerald-400 to-teal-500', icon: Briefcase },
            { value: `${(vendorStats.totalEarnings / 1000).toFixed(0)}K`, label: 'AED Earned', gradient: 'from-amber-400 to-orange-500', icon: DollarSign },
            { value: `${vendorStats.completionRate}%`, label: 'Success', gradient: 'from-cyan-400 to-blue-500', icon: Target }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/15 backdrop-blur-xl rounded-2xl p-3 text-center border border-white/10">
              <div className={`w-8 h-8 mx-auto mb-1 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-xl font-extrabold">{stat.value}</div>
              <div className="text-xs text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 overflow-y-auto px-6 py-5 pb-24 space-y-6">
      {/* Monthly Performance */}
      <div className="animate-fade-in">
        <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          This Month's Performance
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="card-elevated p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs text-muted-foreground">Earnings</div>
            </div>
            <div className="text-xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              {vendorStats.thisMonth.earnings.toLocaleString()} AED
            </div>
            <div className="text-xs text-emerald-500 font-semibold mt-1">↑ 12% from last month</div>
          </div>
          
          <div className="card-elevated p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs text-muted-foreground">Jobs Done</div>
            </div>
            <div className="text-xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
              {vendorStats.thisMonth.jobs} Jobs
            </div>
            <div className="text-xs text-blue-500 font-semibold mt-1">↑ 8% from last month</div>
          </div>
        </div>
      </div>

      {/* Additional Stats Grid */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: '0.05s' }}>
        <div className="card-elevated p-3 text-center bg-gradient-to-br from-purple-500/10 to-fuchsia-500/5 border border-purple-500/20">
          <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="text-lg font-extrabold text-foreground">45</div>
          <div className="text-xs text-muted-foreground">Repeat Clients</div>
        </div>
        
        <div className="card-elevated p-3 text-center bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
          <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Award className="w-4 h-4 text-white" />
          </div>
          <div className="text-lg font-extrabold text-foreground">12</div>
          <div className="text-xs text-muted-foreground">5-Star Reviews</div>
        </div>
        
        <div className="card-elevated p-3 text-center bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20">
          <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div className="text-lg font-extrabold text-foreground">3</div>
          <div className="text-xs text-muted-foreground">This Week</div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="card-elevated p-4 animate-fade-in bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 border border-violet-500/10" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-violet-500" />
            Weekly Earnings
          </h4>
          <span className="text-xs text-emerald-500 font-semibold">+18% vs last week</span>
        </div>
        <div className="flex items-end gap-2 h-16">
          {[40, 65, 45, 80, 55, 90, 70].map((height, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className={`w-full rounded-t-lg ${idx === 5 ? 'bg-gradient-to-t from-violet-600 to-fuchsia-500' : 'bg-gradient-to-t from-violet-400/50 to-fuchsia-400/50'}`}
                style={{ height: `${height}%` }}
              />
              <span className="text-[10px] text-muted-foreground">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Available Jobs */}
      <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Available Jobs</h3>
          <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full text-xs font-bold shadow-lg shadow-rose-500/25">
            {availableJobs.length} new
          </span>
        </div>
        <div className="space-y-3">
          {availableJobs.map((job, idx) => (
            <button
              key={job.id}
              onClick={() => { onSelectJob(job); onNavigate('request-detail'); }}
              className="card-interactive w-full p-4 text-left animate-fade-in group"
              style={{ animationDelay: `${0.1 * idx}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-foreground">{job.title}</h4>
                    {job.urgent && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-rose-500/20">
                        <Zap className="w-3 h-3" />
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{job.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{job.budget}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-500" />{job.distance}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-500" />{job.time}</span>
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
