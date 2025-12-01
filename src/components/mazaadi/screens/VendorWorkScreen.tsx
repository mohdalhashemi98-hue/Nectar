import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, CheckCircle, AlertCircle, Timer, ChevronRight, Briefcase, 
  DollarSign, Send, MessageCircle, Eye, Filter, ChevronDown, MapPin,
  Zap, Star, TrendingUp, FileText, X
} from 'lucide-react';
import { ScreenType, AvailableJob } from '@/types/mazaadi';
import BottomNav from '../BottomNav';
import { CategoryIcon } from '../utils/categoryIcons';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Vendor job types with different statuses
interface VendorJob {
  id: number;
  title: string;
  category: string;
  client: { name: string; member: string };
  budget: string;
  distance: string;
  time: string;
  description: string;
  status: 'available' | 'offer_sent' | 'accepted' | 'in_progress' | 'completed';
  offerAmount?: number;
  earnedAmount?: number;
  rating?: number;
  urgent?: boolean;
}

// Mock vendor jobs data
const vendorJobs: VendorJob[] = [
  {
    id: 1,
    title: 'AC Maintenance Required',
    category: 'AC & HVAC',
    client: { name: 'Mohammed K.', member: '2024' },
    budget: '200-300 AED',
    distance: '2.3 km',
    time: '15 min ago',
    description: 'Need AC maintenance for 2 units in villa.',
    status: 'available',
    urgent: true
  },
  {
    id: 2,
    title: 'AC Installation - Split Unit',
    category: 'AC & HVAC',
    client: { name: 'Sara M.', member: '2024' },
    budget: '400-600 AED',
    distance: '5.2 km',
    time: '2 hours ago',
    description: 'Install new split AC unit in bedroom.',
    status: 'offer_sent',
    offerAmount: 450
  },
  {
    id: 3,
    title: 'Central AC Repair',
    category: 'AC & HVAC',
    client: { name: 'Ali R.', member: '2023' },
    budget: '300-400 AED',
    distance: '3.1 km',
    time: '1 day ago',
    description: 'Central AC not cooling properly.',
    status: 'accepted',
    offerAmount: 350
  },
  {
    id: 4,
    title: 'AC Duct Cleaning',
    category: 'AC & HVAC',
    client: { name: 'Fatima H.', member: '2024' },
    budget: '250-350 AED',
    distance: '4.5 km',
    time: '2 days ago',
    description: 'Full duct cleaning for apartment.',
    status: 'in_progress',
    offerAmount: 280
  },
  {
    id: 5,
    title: 'AC Unit Servicing',
    category: 'AC & HVAC',
    client: { name: 'Omar S.', member: '2023' },
    budget: '150-200 AED',
    distance: '1.8 km',
    time: '1 week ago',
    description: 'Regular servicing for 3 AC units.',
    status: 'completed',
    earnedAmount: 180,
    rating: 5
  },
  {
    id: 6,
    title: 'AC Compressor Replacement',
    category: 'AC & HVAC',
    client: { name: 'Khalid M.', member: '2024' },
    budget: '500-800 AED',
    distance: '6.2 km',
    time: '2 weeks ago',
    description: 'Compressor needs replacement.',
    status: 'completed',
    earnedAmount: 650,
    rating: 4
  }
];

interface VendorWorkScreenProps {
  availableJobs: AvailableJob[];
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectJob: (job: AvailableJob) => void;
}

const VendorWorkScreen = ({ availableJobs, onBack, onNavigate, onSelectJob }: VendorWorkScreenProps) => {
  const [activeTab, setActiveTab] = useState<'available' | 'pending' | 'active' | 'completed'>('available');
  const [showQuickOffer, setShowQuickOffer] = useState<number | null>(null);
  const [quickOfferPrice, setQuickOfferPrice] = useState('');

  const tabs = [
    { key: 'available', label: 'Available', count: vendorJobs.filter(j => j.status === 'available').length },
    { key: 'pending', label: 'Pending', count: vendorJobs.filter(j => j.status === 'offer_sent' || j.status === 'accepted').length },
    { key: 'active', label: 'Active', count: vendorJobs.filter(j => j.status === 'in_progress').length },
    { key: 'completed', label: 'Done', count: vendorJobs.filter(j => j.status === 'completed').length }
  ];

  const filteredJobs = useMemo(() => {
    return vendorJobs.filter(job => {
      if (activeTab === 'available') return job.status === 'available';
      if (activeTab === 'pending') return job.status === 'offer_sent' || job.status === 'accepted';
      if (activeTab === 'active') return job.status === 'in_progress';
      if (activeTab === 'completed') return job.status === 'completed';
      return true;
    });
  }, [activeTab]);

  const stats = {
    totalEarnings: vendorJobs.filter(j => j.status === 'completed').reduce((acc, j) => acc + (j.earnedAmount || 0), 0),
    pendingOffers: vendorJobs.filter(j => j.status === 'offer_sent').length,
    activeJobs: vendorJobs.filter(j => j.status === 'in_progress').length
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'available':
        return { label: 'New', color: 'text-primary', bg: 'bg-primary/10', icon: Briefcase };
      case 'offer_sent':
        return { label: 'Offer Sent', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Send };
      case 'accepted':
        return { label: 'Accepted', color: 'text-success', bg: 'bg-success/10', icon: CheckCircle };
      case 'in_progress':
        return { label: 'In Progress', color: 'text-foreground', bg: 'bg-foreground/10', icon: Timer };
      case 'completed':
        return { label: 'Completed', color: 'text-success', bg: 'bg-success/10', icon: CheckCircle };
      default:
        return { label: status, color: 'text-muted-foreground', bg: 'bg-muted', icon: Clock };
    }
  };

  const handleQuickOffer = (jobId: number) => {
    if (!quickOfferPrice) {
      toast.error('Please enter a price');
      return;
    }
    toast.success(`Offer of ${quickOfferPrice} AED sent!`);
    setShowQuickOffer(null);
    setQuickOfferPrice('');
  };

  const handleEnquire = (job: VendorJob) => {
    toast.success(`Message sent to ${job.client.name}`);
  };

  const handleAcceptJob = (job: VendorJob) => {
    toast.success('Job accepted! Starting work...');
  };

  const handleMarkComplete = (job: VendorJob) => {
    toast.success('Job marked as complete!');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground p-6 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold">My Work</h1>
              <p className="opacity-60 text-sm">Manage your jobs & offers</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
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
              { icon: DollarSign, value: `${stats.totalEarnings}`, label: 'Earned (AED)' },
              { icon: Send, value: stats.pendingOffers, label: 'Pending' },
              { icon: Timer, value: stats.activeJobs, label: 'Active' }
            ].map((stat, idx) => (
              <div key={idx} className="flex-1 bg-white/15 rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-primary-foreground" />
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

      {/* Tabs - Floating */}
      <div className="px-4 -mt-8 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card/95 backdrop-blur-xl rounded-2xl p-1.5 border border-border flex gap-1"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 py-2.5 px-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                  activeTab === tab.key 
                    ? 'bg-primary-foreground/20' 
                    : 'bg-muted'
                }`}>
                  {tab.count}
                </span>
              )}
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
            <p className="text-muted-foreground">No jobs in this category</p>
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
                className="card-elevated overflow-hidden"
              >
                {/* Main Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <CategoryIcon category={job.category} className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{job.title}</h3>
                          {job.urgent && (
                            <span className="px-1.5 py-0.5 bg-primary text-primary-foreground rounded text-[10px] font-bold flex items-center gap-0.5">
                              <Zap className="w-2.5 h-2.5" />
                              URGENT
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{job.client.name}</p>
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full ${statusConfig.bg} flex items-center gap-1`}>
                      <StatusIcon className={`w-3 h-3 ${statusConfig.color}`} />
                      <span className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
                    </div>
                  </div>

                  {/* Job Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="font-semibold text-foreground">{job.budget}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {job.time}
                    </span>
                  </div>

                  {/* Offer Amount / Earned */}
                  {job.offerAmount && job.status !== 'completed' && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-secondary rounded-xl">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Your offer:</span>
                      <span className="font-bold text-foreground">{job.offerAmount} AED</span>
                    </div>
                  )}

                  {job.status === 'completed' && (
                    <div className="flex items-center justify-between mb-3 px-3 py-2 bg-success/10 rounded-xl">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm text-success font-medium">Earned: {job.earnedAmount} AED</span>
                      </div>
                      {job.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-primary fill-primary" />
                          <span className="font-bold text-foreground">{job.rating}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {job.status === 'available' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEnquire(job)}
                          className="flex-1"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Enquire
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setShowQuickOffer(showQuickOffer === job.id ? null : job.id)}
                          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Send Offer
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const availJob = availableJobs.find(j => j.title === job.title) || {
                              id: job.id,
                              title: job.title,
                              budget: job.budget,
                              distance: job.distance,
                              time: job.time,
                              urgent: job.urgent || false,
                              category: job.category,
                              description: job.description,
                              client: job.client
                            };
                            onSelectJob(availJob as AvailableJob);
                            onNavigate('request-detail');
                          }}
                          className="px-2"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </>
                    )}

                    {job.status === 'offer_sent' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEnquire(job)}
                          className="flex-1"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 text-muted-foreground"
                          disabled
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Awaiting Response
                        </Button>
                      </>
                    )}

                    {job.status === 'accepted' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEnquire(job)}
                          className="flex-1"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptJob(job)}
                          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Start Job
                        </Button>
                      </>
                    )}

                    {job.status === 'in_progress' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEnquire(job)}
                          className="flex-1"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleMarkComplete(job)}
                          className="flex-1 bg-success text-white hover:bg-success/90"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Complete
                        </Button>
                      </>
                    )}

                    {job.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {}}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    )}
                  </div>
                </div>

                {/* Quick Offer Panel */}
                <AnimatePresence>
                  {showQuickOffer === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border overflow-hidden"
                    >
                      <div className="p-4 bg-secondary/50">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="number"
                              value={quickOfferPrice}
                              onChange={(e) => setQuickOfferPrice(e.target.value)}
                              placeholder="Your price (AED)"
                              className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleQuickOffer(job.id)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setShowQuickOffer(null);
                              setQuickOfferPrice('');
                            }}
                            className="h-10 px-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Budget range: {job.budget}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      <BottomNav active="transactions" userType="vendor" onNavigate={onNavigate} />
    </div>
  );
};

export default VendorWorkScreen;
