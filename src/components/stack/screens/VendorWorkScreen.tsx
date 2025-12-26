import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, CheckCircle, Timer, ChevronRight, Briefcase, 
  DollarSign, Send, MessageCircle, MapPin, Navigation,
  Zap, Star, TrendingUp, FileText, X, Users, Lightbulb,
  Ban, Phone, Wallet, AlertCircle, ThumbsUp, ArrowRight
} from 'lucide-react';
import { ScreenType, AvailableJob } from '@/types/stack';
import BottomNav from '../BottomNav';
import { CategoryIcon } from '../utils/categoryIcons';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { haptic } from '@/hooks/use-haptic';

// Vendor job types with different statuses
interface VendorJob {
  id: number;
  title: string;
  category: string;
  location: string;
  client: { name: string; rating: number; memberSince: string };
  budgetRange: { min: number; max: number };
  distance: string;
  timePosted: string;
  timeframe: string;
  description: string;
  status: 'new_lead' | 'quoted' | 'active_en_route' | 'active_arrived' | 'active_working' | 'active_payment' | 'completed' | 'cancelled' | 'declined';
  quotingPros?: number;
  offerAmount?: number;
  scheduledDate?: string;
  scheduledTime?: string;
  earnedAmount?: number;
  platformFee?: number;
  netEarnings?: number;
  rating?: number;
  hasReview?: boolean;
  urgent?: boolean;
}

// Mock vendor jobs data with enhanced fields
const vendorJobs: VendorJob[] = [
  {
    id: 1,
    title: 'AC Deep Cleaning',
    category: 'AC & HVAC',
    location: 'JLT, Cluster R',
    client: { name: 'Mohammed K.', rating: 4.8, memberSince: '2024' },
    budgetRange: { min: 750, max: 900 },
    distance: '2.3 km',
    timePosted: '15 min ago',
    timeframe: 'Tomorrow afternoon (Flexible)',
    description: 'Need deep cleaning for 2 split AC units in apartment.',
    status: 'new_lead',
    quotingPros: 3,
    urgent: true
  },
  {
    id: 2,
    title: 'AC Installation - Split Unit',
    category: 'AC & HVAC',
    location: 'Dubai Marina, Tower 5',
    client: { name: 'Sara M.', rating: 4.5, memberSince: '2024' },
    budgetRange: { min: 400, max: 600 },
    distance: '5.2 km',
    timePosted: '2 hours ago',
    timeframe: 'This weekend',
    description: 'Install new split AC unit in master bedroom.',
    status: 'new_lead',
    quotingPros: 5
  },
  {
    id: 3,
    title: 'Central AC Repair',
    category: 'AC & HVAC',
    location: 'Business Bay, Executive Tower',
    client: { name: 'Ali R.', rating: 4.9, memberSince: '2023' },
    budgetRange: { min: 300, max: 400 },
    distance: '3.1 km',
    timePosted: '1 day ago',
    timeframe: 'ASAP - Urgent',
    description: 'Central AC not cooling properly, needs urgent repair.',
    status: 'active_en_route',
    offerAmount: 350,
    scheduledDate: 'Today',
    scheduledTime: '2:00 PM'
  },
  {
    id: 4,
    title: 'AC Duct Cleaning',
    category: 'AC & HVAC',
    location: 'Palm Jumeirah, Villa 42',
    client: { name: 'Fatima H.', rating: 4.7, memberSince: '2024' },
    budgetRange: { min: 250, max: 350 },
    distance: '4.5 km',
    timePosted: '2 days ago',
    timeframe: 'Next week',
    description: 'Full duct cleaning for 4-bedroom villa.',
    status: 'active_working',
    offerAmount: 280,
    scheduledDate: 'Today',
    scheduledTime: '10:00 AM'
  },
  {
    id: 5,
    title: 'AC Unit Servicing',
    category: 'AC & HVAC',
    location: 'Downtown Dubai, Burj Views',
    client: { name: 'Omar S.', rating: 5.0, memberSince: '2023' },
    budgetRange: { min: 150, max: 200 },
    distance: '1.8 km',
    timePosted: '1 week ago',
    timeframe: 'Completed',
    description: 'Regular servicing for 3 AC units.',
    status: 'completed',
    earnedAmount: 180,
    platformFee: 18,
    netEarnings: 162,
    rating: 5,
    hasReview: true
  },
  {
    id: 6,
    title: 'AC Compressor Replacement',
    category: 'AC & HVAC',
    location: 'Al Barsha, Villa Complex',
    client: { name: 'Khalid M.', rating: 4.6, memberSince: '2024' },
    budgetRange: { min: 500, max: 800 },
    distance: '6.2 km',
    timePosted: '2 weeks ago',
    timeframe: 'Completed',
    description: 'Compressor replacement for central AC.',
    status: 'completed',
    earnedAmount: 650,
    platformFee: 65,
    netEarnings: 585,
    rating: 4,
    hasReview: false
  },
  {
    id: 7,
    title: 'Window AC Installation',
    category: 'AC & HVAC',
    location: 'Deira, Clock Tower',
    client: { name: 'Hana L.', rating: 4.3, memberSince: '2024' },
    budgetRange: { min: 200, max: 300 },
    distance: '8.1 km',
    timePosted: '3 weeks ago',
    timeframe: 'Cancelled',
    description: 'Window AC unit installation.',
    status: 'cancelled',
    offerAmount: 250
  }
];

interface VendorWorkScreenProps {
  availableJobs: AvailableJob[];
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectJob: (job: AvailableJob) => void;
}

const VendorWorkScreen = ({ availableJobs, onBack, onNavigate, onSelectJob }: VendorWorkScreenProps) => {
  const [activeTab, setActiveTab] = useState<'new_leads' | 'active' | 'history'>('new_leads');
  const [showQuotingPanel, setShowQuotingPanel] = useState<number | null>(null);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteMessage, setQuoteMessage] = useState('');

  const tabs = [
    { key: 'new_leads', label: 'New Leads', count: vendorJobs.filter(j => j.status === 'new_lead').length },
    { key: 'active', label: 'Active Jobs', count: vendorJobs.filter(j => j.status.startsWith('active_')).length },
    { key: 'history', label: 'History', count: vendorJobs.filter(j => j.status === 'completed' || j.status === 'cancelled').length }
  ];

  const filteredJobs = useMemo(() => {
    return vendorJobs.filter(job => {
      if (activeTab === 'new_leads') return job.status === 'new_lead';
      if (activeTab === 'active') return job.status.startsWith('active_');
      if (activeTab === 'history') return job.status === 'completed' || job.status === 'cancelled';
      return true;
    }).sort((a, b) => {
      // Sort logic based on tab
      if (activeTab === 'new_leads') {
        // Newest first, urgent priority
        if (a.urgent && !b.urgent) return -1;
        if (!a.urgent && b.urgent) return 1;
        return 0;
      }
      if (activeTab === 'active') {
        // By scheduled time (soonest first)
        return 0;
      }
      // History: most recent first
      return 0;
    });
  }, [activeTab]);

  const stats = {
    totalEarnings: vendorJobs.filter(j => j.status === 'completed').reduce((acc, j) => acc + (j.netEarnings || 0), 0),
    newLeads: vendorJobs.filter(j => j.status === 'new_lead').length,
    activeJobs: vendorJobs.filter(j => j.status.startsWith('active_')).length
  };

  // AI Price recommendation logic
  const getAIPriceRecommendation = (budget: { min: number; max: number }, proposedPrice: number) => {
    const avgBudget = (budget.min + budget.max) / 2;
    const diff = ((proposedPrice - avgBudget) / avgBudget) * 100;
    
    if (diff > 10) {
      return {
        type: 'high' as const,
        message: `Your quote is ${Math.abs(diff).toFixed(0)}% above average. Consider ${Math.round(avgBudget * 1.05)} AED for better win rate.`,
        optimizedPrice: Math.round(avgBudget * 1.05),
        winRateChange: '+25%'
      };
    } else if (diff < -10) {
      return {
        type: 'low' as const,
        message: `Your quote is ${Math.abs(diff).toFixed(0)}% below average. You could charge ${Math.round(avgBudget)} AED and still win.`,
        optimizedPrice: Math.round(avgBudget),
        profitIncrease: `+${Math.round(avgBudget - proposedPrice)} AED`
      };
    }
    return {
      type: 'optimal' as const,
      message: 'Your quote is competitively priced for this job.',
      optimizedPrice: proposedPrice
    };
  };

  const handleSubmitQuote = (jobId: number, job: VendorJob) => {
    if (!quoteAmount) {
      toast.error('Please enter your quote amount');
      return;
    }
    haptic('success');
    toast.success(`Quote of ${quoteAmount} AED sent to ${job.client.name}!`);
    setShowQuotingPanel(null);
    setQuoteAmount('');
    setQuoteMessage('');
  };

  const handleDeclineJob = (job: VendorJob) => {
    toast.success('Job declined. You won\'t see this lead anymore.');
  };

  const handleUpdateStatus = (job: VendorJob, newStatus: string) => {
    const statusMessages: Record<string, string> = {
      'active_en_route': `${job.client.name} has been notified you're on your way!`,
      'active_arrived': `${job.client.name} has been notified you've arrived.`,
      'active_working': 'Work started! Keep up the great work.',
      'active_payment': `Invoice sent to ${job.client.name}. Awaiting payment.`
    };
    toast.success(statusMessages[newStatus] || 'Status updated!');
  };

  const handleNavigateToJob = (job: VendorJob) => {
    toast.success('Opening Maps with job location...');
    // In real app: window.open(`https://maps.google.com/?q=${job.location}`, '_blank');
  };

  const handleMessageCustomer = (job: VendorJob) => {
    onNavigate('chat');
  };

  const handleAskForReview = (job: VendorJob) => {
    toast.success(`Review request sent to ${job.client.name}!`);
  };

  const getActiveStatusConfig = (status: string) => {
    switch (status) {
      case 'active_en_route':
        return { label: 'En Route', color: 'text-blue-500', bg: 'bg-blue-500/10', next: 'active_arrived', nextLabel: 'Mark Arrived' };
      case 'active_arrived':
        return { label: 'Arrived', color: 'text-primary', bg: 'bg-primary/10', next: 'active_working', nextLabel: 'Start Work' };
      case 'active_working':
        return { label: 'Working', color: 'text-orange-500', bg: 'bg-orange-500/10', next: 'active_payment', nextLabel: 'Ready for Payment' };
      case 'active_payment':
        return { label: 'Awaiting Payment', color: 'text-green-500', bg: 'bg-green-500/10', next: null, nextLabel: null };
      default:
        return { label: 'Active', color: 'text-foreground', bg: 'bg-muted', next: null, nextLabel: null };
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground px-4 py-6 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold">My Jobs</h1>
              <p className="opacity-60 text-sm">Manage your pipeline & earnings</p>
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
              { icon: Zap, value: stats.newLeads, label: 'New Leads', highlight: true },
              { icon: Timer, value: stats.activeJobs, label: 'Active' },
              { icon: Wallet, value: `${stats.totalEarnings}`, label: 'Net Earnings' }
            ].map((stat, idx) => (
              <div key={idx} className={`flex-1 ${stat.highlight ? 'bg-white/25' : 'bg-white/15'} rounded-2xl p-3`}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl ${stat.highlight ? 'bg-white/30' : 'bg-white/20'} flex items-center justify-center`}>
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
            <p className="text-muted-foreground">
              {activeTab === 'new_leads' && 'No new leads at the moment'}
              {activeTab === 'active' && 'No active jobs right now'}
              {activeTab === 'history' && 'No completed jobs yet'}
            </p>
          </div>
        ) : (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.03 }}
              className="card-elevated overflow-hidden"
            >
              {/* NEW LEADS TAB CARD */}
              {activeTab === 'new_leads' && (
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display text-lg font-bold text-foreground">{job.title}, {job.location.split(',')[0]}</h3>
                        {job.urgent && (
                          <span className="px-1.5 py-0.5 bg-primary text-primary-foreground rounded text-[10px] font-bold flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" />
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Needed: {job.timeframe}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <CategoryIcon category={job.category} className="w-6 h-6 text-foreground" />
                    </div>
                  </div>

                  {/* Budget & Competition */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between px-3 py-2 bg-primary/5 rounded-xl border border-primary/10">
                      <span className="text-sm text-muted-foreground">Consumer Budget:</span>
                      <span className="font-bold text-primary">{job.budgetRange.min} - {job.budgetRange.max} AED</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-orange-500/5 rounded-xl border border-orange-500/10">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Competition:
                      </span>
                      <span className="font-semibold text-orange-600">You are 1 of {job.quotingPros} Pros quoting</span>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {job.timePosted}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-primary fill-primary" />
                      {job.client.rating} · {job.client.name}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowQuotingPanel(showQuotingPanel === job.id ? null : job.id)}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Details & Quote
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeclineJob(job)}
                      className="px-4 border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      <Ban className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* QUOTING PANEL */}
              <AnimatePresence>
                {showQuotingPanel === job.id && activeTab === 'new_leads' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border overflow-hidden"
                  >
                    <div className="p-4 bg-secondary/30">
                      {/* Job Description */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-1">Job Details</h4>
                        <p className="text-sm text-muted-foreground">{job.description}</p>
                      </div>

                      {/* Quote Input */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Your Quote (AED)</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="number"
                              value={quoteAmount}
                              onChange={(e) => setQuoteAmount(e.target.value)}
                              placeholder="Enter amount"
                              className="w-full pl-9 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        </div>

                        {/* AI Price Recommendation */}
                        {quoteAmount && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 rounded-xl border ${
                              getAIPriceRecommendation(job.budgetRange, parseFloat(quoteAmount)).type === 'optimal'
                                ? 'bg-green-500/10 border-green-500/20'
                                : getAIPriceRecommendation(job.budgetRange, parseFloat(quoteAmount)).type === 'high'
                                ? 'bg-orange-500/10 border-orange-500/20'
                                : 'bg-blue-500/10 border-blue-500/20'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <Lightbulb className={`w-4 h-4 mt-0.5 ${
                                getAIPriceRecommendation(job.budgetRange, parseFloat(quoteAmount)).type === 'optimal'
                                  ? 'text-green-500'
                                  : 'text-primary'
                              }`} />
                              <div>
                                <p className="text-xs font-semibold text-foreground mb-0.5">AI Price Check</p>
                                <p className="text-xs text-muted-foreground">
                                  {getAIPriceRecommendation(job.budgetRange, parseFloat(quoteAmount)).message}
                                </p>
                                {getAIPriceRecommendation(job.budgetRange, parseFloat(quoteAmount)).winRateChange && (
                                  <span className="inline-block mt-1 text-[10px] font-bold text-green-600 bg-green-500/20 px-2 py-0.5 rounded">
                                    {getAIPriceRecommendation(job.budgetRange, parseFloat(quoteAmount)).winRateChange} win rate
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Message */}
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Message (Optional)</label>
                          <textarea
                            value={quoteMessage}
                            onChange={(e) => setQuoteMessage(e.target.value)}
                            placeholder="Introduce yourself and highlight your experience..."
                            rows={2}
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
                          />
                        </div>

                        {/* Submit */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSubmitQuote(job.id, job)}
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Submit Quote
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setShowQuotingPanel(null);
                              setQuoteAmount('');
                              setQuoteMessage('');
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ACTIVE JOBS TAB CARD */}
              {activeTab === 'active' && (
                <div className="p-4">
                  {/* Header with Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <CategoryIcon category={job.category} className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.client.name}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full ${getActiveStatusConfig(job.status).bg}`}>
                      <span className={`text-xs font-bold ${getActiveStatusConfig(job.status).color}`}>
                        {getActiveStatusConfig(job.status).label}
                      </span>
                    </div>
                  </div>

                  {/* Schedule Info */}
                  <div className="flex items-center gap-4 text-sm mb-3 px-3 py-2 bg-secondary/50 rounded-xl">
                    <span className="flex items-center gap-1.5 text-foreground font-medium">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {job.scheduledDate} at {job.scheduledTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                  </div>

                  {/* Quote Amount */}
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-primary/5 rounded-xl border border-primary/10">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Agreed Price:</span>
                    <span className="font-bold text-primary">{job.offerAmount} AED</span>
                  </div>

                  {/* Status Update Buttons */}
                  <div className="flex gap-2 mb-3">
                    {getActiveStatusConfig(job.status).next && (
                      <Button
                        onClick={() => handleUpdateStatus(job, getActiveStatusConfig(job.status).next!)}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        {getActiveStatusConfig(job.status).nextLabel}
                      </Button>
                    )}
                    {job.status === 'active_payment' && (
                      <Button
                        variant="outline"
                        className="flex-1 border-green-500/30 text-green-600"
                        disabled
                      >
                        <Timer className="w-4 h-4 mr-2" />
                        Awaiting Customer Payment
                      </Button>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleNavigateToJob(job)}
                      className="flex-1"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Navigate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleMessageCustomer(job)}
                      className="flex-1"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-3"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* HISTORY TAB CARD */}
              {activeTab === 'history' && (
                <div className="p-4">
                  {/* Review Request Banner (for completed without review) */}
                  {job.status === 'completed' && !job.hasReview && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-3 p-3 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">No review yet</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAskForReview(job)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        Ask for Review
                      </Button>
                    </motion.div>
                  )}

                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <CategoryIcon category={job.category} className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.client.name}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full ${
                      job.status === 'completed' ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      <span className={`text-xs font-bold ${
                        job.status === 'completed' ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {job.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </span>
                    </div>
                  </div>

                  {/* Rating (if completed with review) */}
                  {job.status === 'completed' && job.hasReview && job.rating && (
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-primary/5 rounded-xl border border-primary/10">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span className="font-bold text-foreground">{job.rating}.0</span>
                      <span className="text-sm text-muted-foreground">Customer Rating</span>
                      <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                    </div>
                  )}

                  {/* Financial Breakdown (for completed jobs) */}
                  {job.status === 'completed' && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between px-3 py-2 bg-secondary/50 rounded-xl">
                        <span className="text-sm text-muted-foreground">Final Payout</span>
                        <span className="font-semibold text-foreground">{job.earnedAmount} AED</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 bg-secondary/50 rounded-xl">
                        <span className="text-sm text-muted-foreground">Platform Fee (10%)</span>
                        <span className="font-medium text-red-500">-{job.platformFee} AED</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2.5 bg-green-500/10 rounded-xl border border-green-500/20">
                        <span className="text-sm font-semibold text-foreground">Net Earnings</span>
                        <span className="font-bold text-green-600">{job.netEarnings} AED</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => onNavigate('transactions')}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Payouts & Wallet
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-4"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      <BottomNav active="transactions" userType="vendor" onNavigate={onNavigate} />
    </div>
  );
};

export default VendorWorkScreen;
