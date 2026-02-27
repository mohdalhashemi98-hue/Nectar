import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, Timer, Star, ChevronRight, Briefcase, Plus, MapPin, Calendar, Users, RefreshCw } from 'lucide-react';
import { Job, ScreenType, UserType } from '@/types/stack';
import { useState } from 'react';
import BottomNav from '../BottomNav';
import { CategoryIcon } from '../utils/categoryIcons';
import { useUpdateJobStatus } from '@/hooks/use-data-queries';
import { toast } from 'sonner';
import { ScreenHeader } from '@/components/shared';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface JobsScreenProps {
  jobs: Job[];
  userType: UserType;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectJob: (job: Job) => void;
}

const marketJobs = [
  { id: 'm1', title: 'Kitchen Deep Cleaning', category: 'Cleaning', location: 'Dubai Marina', budget: '200-350 AED', postedTime: '2 hours ago', proposals: 5, description: 'Professional kitchen deep cleaning service including appliances.' },
  { id: 'm2', title: 'AC Maintenance & Repair', category: 'AC Services', location: 'JBR', budget: '150-300 AED', postedTime: '4 hours ago', proposals: 8, description: 'Annual AC maintenance for 3 units.' },
  { id: 'm3', title: 'Furniture Assembly', category: 'Handyman', location: 'Downtown Dubai', budget: '100-200 AED', postedTime: '6 hours ago', proposals: 3, description: 'Need help assembling IKEA furniture.' },
  { id: 'm4', title: 'Bathroom Plumbing Fix', category: 'Plumbing', location: 'Business Bay', budget: '250-400 AED', postedTime: '1 day ago', proposals: 12, description: 'Leaking faucet and slow drain.' },
  { id: 'm5', title: 'Home Painting - 2 Rooms', category: 'Painting', location: 'Al Barsha', budget: '800-1200 AED', postedTime: '1 day ago', proposals: 7, description: 'Repaint 2 bedrooms, walls and ceiling.' }
];

const JobsScreen = ({ jobs, userType, onBack, onNavigate, onSelectJob }: JobsScreenProps) => {
  const [activeTab, setActiveTab] = useState<'market' | 'active' | 'previous'>('market');
  const updateJobStatus = useUpdateJobStatus();
  const statusOptions = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

  const handleStatusChange = async (job: Job, newStatus: string) => {
    if (!job.uuid) { toast.error('Cannot update job: missing job ID'); return; }
    try {
      await updateJobStatus.mutateAsync({ jobId: job.uuid, status: newStatus });
      toast.success(`Job status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update job status.');
    }
  };

  const tabs = [{ key: 'market', label: 'Browse Market' }, { key: 'active', label: 'Active' }, { key: 'previous', label: 'Previous' }];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Completed': return { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' };
      case 'In Progress': return { icon: Timer, color: 'text-foreground', bg: 'bg-foreground/10' };
      case 'Pending': return { icon: Clock, color: 'text-warning', bg: 'bg-warning/10' };
      default: return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' };
    }
  };

  const activeJobs = jobs.filter(job => job.status === 'Pending' || job.status === 'In Progress' || job.status === 'Awaiting Completion');
  const previousJobs = jobs.filter(job => job.status === 'Completed');

  return (
    <div className="w-full bg-background pb-24">
      <ScreenHeader
        title="Jobs"
        subtitle="Find services or track requests"
        onBack={onBack}
        icon={Briefcase}
        rightAction={
          <button onClick={() => onNavigate('post-request')} className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary-foreground" />
          </button>
        }
      />

      {/* Tabs */}
      <div className="px-4 py-3">
        <div className="bg-secondary rounded-xl p-1 flex gap-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-medium transition-all ${activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Market Jobs */}
      {activeTab === 'market' && (
        <div className="p-4 space-y-3">
          <div className="card-elevated p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Plus className="w-5 h-5 text-primary" /></div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm">Need a service?</h3>
                <p className="text-xs text-muted-foreground">Post a job and get offers</p>
              </div>
              <button onClick={() => onNavigate('post-request')} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Post Job</button>
            </div>
          </div>

          <h2 className="font-semibold text-foreground text-sm mb-3">Open Jobs in Market</h2>
          {marketJobs.map((job, index) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="card-elevated p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><CategoryIcon category={job.category} className="w-5 h-5 text-foreground" /></div>
                <div className="flex-1"><h3 className="font-semibold text-foreground text-sm">{job.title}</h3><p className="text-xs text-muted-foreground">{job.category}</p></div>
                <span className="text-sm font-bold text-primary">{job.budget}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</div>
                <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{job.postedTime}</div>
                <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{job.proposals} proposals</div>
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center"><Briefcase className="w-8 h-8 text-muted-foreground" /></div>
              <p className="text-muted-foreground mb-4">No active jobs</p>
              <button onClick={() => onNavigate('post-request')} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Post Your First Job</button>
            </div>
          ) : (
            activeJobs.map((job, index) => {
              const statusConfig = getStatusConfig(job.status);
              const StatusIcon = statusConfig.icon;
              const hasPendingOffers = job.status === 'Pending' && job.offersCount && job.offersCount > 0;
              return (
                <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="card-elevated p-4" onClick={() => { onSelectJob(job); onNavigate(hasPendingOffers ? 'quote-management' : 'job-detail'); }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><CategoryIcon category={job.category} className="w-5 h-5 text-foreground" /></div>
                      <div><h3 className="font-semibold text-foreground text-sm">{job.title}</h3><p className="text-xs text-muted-foreground">{job.category}</p></div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} className={`px-3 py-1.5 rounded-xl ${statusConfig.bg} flex items-center gap-1.5`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
                        <span className={`text-xs font-medium ${statusConfig.color}`}>{job.status}</span>
                        <RefreshCw className={`w-3 h-3 ${statusConfig.color} ${updateJobStatus.isPending ? 'animate-spin' : ''}`} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        {statusOptions.map((status) => (<DropdownMenuItem key={status} onClick={() => handleStatusChange(job, status)} disabled={job.status === status}>{status}</DropdownMenuItem>))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {job.vendor && (<div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{job.vendor.charAt(0)}</div><span className="text-xs text-muted-foreground">{job.vendor}</span></div>)}
                      {hasPendingOffers && (<span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg">{job.offersCount} offers</span>)}
                    </div>
                    <div className="flex items-center gap-3">
                      {job.amount > 0 && <span className="font-bold text-foreground text-sm">{job.amount} AED</span>}
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center"><Briefcase className="w-8 h-8 text-muted-foreground" /></div>
              <p className="text-muted-foreground">No previous jobs</p>
            </div>
          ) : (
            previousJobs.map((job, index) => {
              const statusConfig = getStatusConfig(job.status);
              const StatusIcon = statusConfig.icon;
              const canReview = userType === 'consumer' && job.status === 'Completed' && !job.rated;
              return (
                <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="card-elevated p-4">
                  <div className="flex items-start justify-between mb-3" onClick={() => onSelectJob(job)}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><CategoryIcon category={job.category} className="w-5 h-5 text-foreground" /></div>
                      <div><h3 className="font-semibold text-foreground text-sm">{job.title}</h3><p className="text-xs text-muted-foreground">{job.category}</p></div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl ${statusConfig.bg} flex items-center gap-1.5`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${statusConfig.color}`} />
                      <span className={`text-xs font-medium ${statusConfig.color}`}>{job.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between" onClick={() => onSelectJob(job)}>
                    <div className="flex items-center gap-4">
                      {job.vendor && (<div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{job.vendor.charAt(0)}</div><span className="text-xs text-muted-foreground">{job.vendor}</span></div>)}
                    </div>
                    <div className="flex items-center gap-3">
                      {job.amount > 0 && <span className="font-bold text-foreground text-sm">{job.amount} AED</span>}
                      {job.rated && (<div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg"><Star className="w-4 h-4 text-primary fill-primary" /><span className="text-sm font-bold">{job.rating}</span></div>)}
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  {canReview && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <button onClick={(e) => { e.stopPropagation(); onSelectJob(job); onNavigate('review'); }} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                        <Star className="w-4 h-4" /> Leave a Review
                      </button>
                    </div>
                  )}
                  {job.pointsEarned > 0 && !canReview && (
                    <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
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
