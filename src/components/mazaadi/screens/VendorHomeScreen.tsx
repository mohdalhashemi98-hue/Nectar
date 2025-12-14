import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Bell, DollarSign, Briefcase, MapPin, Clock, ChevronRight, Zap, TrendingUp, 
  TrendingDown, Users, Calendar, Target, Award, BarChart3, MessageSquare, 
  Wallet, Settings, Sparkles, ArrowUpRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { VendorStats, AvailableJob, ScreenType } from '@/types/mazaadi';
import BottomNav from '../BottomNav';
import { VendorHomeSkeleton } from '../ScreenSkeleton';
import { CategoryIcon } from '../utils/categoryIcons';
import AvailabilityToggle from '../AvailabilityToggle';
import nectarLogo from '@/assets/nectar-logo.png';

// Mock priority action data
const priorityActions = {
  newRequests: 3,
  unreadMessages: 1,
  todaysBookings: 2
};

// Mock KPI data (comparing last 7 days vs previous period)
const kpiData = {
  conversionRate: { value: 18, change: 2, direction: 'up' as const },
  responseTime: { value: 12, change: -3, direction: 'down' as const, benchmark: 15 },
  satisfaction: { value: 4.8, reviews: 156 }
};

// Mock high probability leads
const highProbabilityLeads = [
  {
    id: 101,
    title: 'AC Deep Cleaning - Villa',
    category: 'AC & Ventilation',
    estimatedPayout: '280-350 AED',
    winProbability: 85,
    distance: '2.1 km',
    urgent: true,
    postedAgo: '5 min ago'
  },
  {
    id: 102,
    title: 'Split AC Installation',
    category: 'AC & Ventilation',
    estimatedPayout: '450-600 AED',
    winProbability: 78,
    distance: '3.5 km',
    urgent: false,
    postedAgo: '12 min ago'
  },
  {
    id: 103,
    title: 'Emergency AC Repair',
    category: 'AC & Ventilation',
    estimatedPayout: '200-300 AED',
    winProbability: 72,
    distance: '4.2 km',
    urgent: true,
    postedAgo: '18 min ago'
  }
];

// Mock AI price insight
const aiPriceInsight = {
  yourQuote: 200,
  benchmarkPrice: 185,
  difference: '+15%',
  adjustedWinChance: 30
};

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
}: VendorHomeScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <VendorHomeSkeleton />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-golden text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl" />
        
        <div className="px-6 py-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-foreground/20 flex items-center justify-center text-xl font-bold">
                AM
              </div>
              <div>
                <h1 className="font-display text-xl font-bold">Ahmad Al-Mansouri</h1>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{vendorStats.rating} • {vendorStats.reviews} reviews</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onNavigate('notifications')} 
                className="relative p-2.5 bg-primary-foreground/20 rounded-xl hover:bg-primary-foreground/30 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {(priorityActions.newRequests + priorityActions.unreadMessages) > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                    {priorityActions.newRequests + priorityActions.unreadMessages}
                  </span>
                )}
              </button>
              <button 
                onClick={() => onNavigate('profile')} 
                className="p-2.5 bg-primary-foreground/20 rounded-xl hover:bg-primary-foreground/30 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
        {/* Availability Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <AvailabilityToggle 
            initialAvailable={isAvailable}
            onToggle={setIsAvailable}
          />
        </motion.div>

        {/* Priority Action Cards - Horizontal Scroll */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-3 gap-2">
            {/* New Requests Card */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('transactions')}
              className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold flex items-center justify-center">
                  {priorityActions.newRequests}
                </span>
              </div>
              <div className="text-xs font-semibold text-foreground">New Requests</div>
              <div className="text-[10px] text-muted-foreground">Awaiting Quote</div>
            </motion.button>

            {/* Unread Messages Card */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('messages-list')}
              className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold flex items-center justify-center">
                  {priorityActions.unreadMessages}
                </span>
              </div>
              <div className="text-xs font-semibold text-foreground">Unread Chats</div>
              <div className="text-[10px] text-muted-foreground">Messages</div>
            </motion.button>

            {/* Today's Bookings Card */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('transactions')}
              className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl p-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <span className="w-6 h-6 bg-green-500 text-white rounded-full text-xs font-bold flex items-center justify-center">
                  {priorityActions.todaysBookings}
                </span>
              </div>
              <div className="text-xs font-semibold text-foreground">Today's Jobs</div>
              <div className="text-[10px] text-muted-foreground">Scheduled</div>
            </motion.button>
          </div>
        </motion.div>

        {/* Core Business Metrics (3 Cs) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Performance (Last 7 Days)
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {/* Quote Conversion Rate */}
            <div className="bg-card rounded-2xl border border-border p-3 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-primary/10 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div className="font-display text-xl font-bold text-foreground">
                {kpiData.conversionRate.value}%
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                {kpiData.conversionRate.direction === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-[10px] font-medium ${
                  kpiData.conversionRate.direction === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {kpiData.conversionRate.direction === 'up' ? '+' : ''}{kpiData.conversionRate.change}%
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground">Conversion</div>
            </div>

            {/* Response Time */}
            <div className="bg-card rounded-2xl border border-border p-3 text-center">
              <div className="w-8 h-8 mx-auto mb-2 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <div className="font-display text-xl font-bold text-foreground">
                {kpiData.responseTime.value}m
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingDown className="w-3 h-3 text-green-500" />
                <span className="text-[10px] font-medium text-green-500">
                  {kpiData.responseTime.change}m
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground">Avg Response</div>
            </div>

            {/* Customer Satisfaction */}
            <button 
              onClick={() => onNavigate('profile')}
              className="bg-card rounded-2xl border border-border p-3 text-center hover:border-primary/30 transition-colors"
            >
              <div className="w-8 h-8 mx-auto mb-2 bg-primary/10 rounded-xl flex items-center justify-center">
                <Star className="w-4 h-4 text-primary fill-primary" />
              </div>
              <div className="font-display text-xl font-bold text-foreground flex items-center justify-center gap-1">
                {kpiData.satisfaction.value}
                <Star className="w-3 h-3 text-primary fill-primary" />
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-[10px] font-medium text-green-500">Consistent</span>
              </div>
              <div className="text-[10px] text-muted-foreground">CSAT</div>
            </button>
          </div>
        </motion.div>

        {/* AI Market Benchmark Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-4 relative overflow-hidden"
        >
          <div className="absolute top-2 right-2">
            <Sparkles className="w-5 h-5 text-primary/40" />
          </div>
          
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">AI Price Check</h4>
              <p className="text-xs text-muted-foreground">Your AC Repair pricing analysis</p>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Your Quote</span>
              <span className="font-bold text-foreground">{aiPriceInsight.yourQuote} AED</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Nectar Benchmark</span>
              <span className="font-bold text-primary">{aiPriceInsight.benchmarkPrice} AED</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span className="text-xs text-foreground">
                Your quote is <span className="font-bold text-primary">{aiPriceInsight.difference}</span> above benchmark. 
                Adjust to {aiPriceInsight.benchmarkPrice} AED for <span className="font-bold text-green-500">{aiPriceInsight.adjustedWinChance}% higher</span> win chance.
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate('market-benchmark')}
            className="w-full flex items-center justify-center gap-2 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            View Full Market Analysis
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* High Probability Leads */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              High Probability Leads
            </h3>
            <button 
              onClick={() => onNavigate('transactions')}
              className="text-sm text-primary font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {highProbabilityLeads.map((lead, idx) => (
              <motion.button
                key={lead.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const job = availableJobs.find(j => j.id === lead.id) || {
                    id: lead.id,
                    title: lead.title,
                    budget: lead.estimatedPayout,
                    distance: lead.distance,
                    time: lead.postedAgo,
                    urgent: lead.urgent,
                    category: lead.category,
                    description: '',
                    client: { name: 'Customer', member: 'Gold Member' }
                  };
                  onSelectJob(job as AvailableJob);
                  onNavigate('request-detail');
                }}
                className="w-full bg-card rounded-2xl border border-border p-4 text-left hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <CategoryIcon category={lead.category} className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground text-sm">{lead.title}</h4>
                        {lead.urgent && (
                          <span className="px-1.5 py-0.5 bg-primary text-primary-foreground rounded text-[10px] font-bold flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5" />
                            URGENT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {lead.distance}
                        </span>
                        <span>{lead.postedAgo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">{lead.estimatedPayout}</div>
                    <div className="flex items-center gap-1 justify-end">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-[10px] text-green-600 font-medium">{lead.winProbability}% match</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-2 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  Quote Now
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quick Access Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-display text-lg font-bold text-foreground mb-3">Quick Access</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('vendor-schedule')}
              className="bg-card rounded-2xl border border-border p-4 text-center hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-secondary rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-foreground" />
              </div>
              <div className="text-sm font-medium text-foreground">My Schedule</div>
            </button>
            
            <button
              onClick={() => onNavigate('company-profile')}
              className="bg-card rounded-2xl border border-border p-4 text-center hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-secondary rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-foreground" />
              </div>
              <div className="text-sm font-medium text-foreground">Services & Prices</div>
            </button>
            
            <button
              onClick={() => onNavigate('transactions')}
              className="bg-card rounded-2xl border border-border p-4 text-center hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-secondary rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-foreground" />
              </div>
              <div className="text-sm font-medium text-foreground">Payouts</div>
            </button>
          </div>
        </motion.div>
      </div>

      <BottomNav active="home" userType="vendor" onNavigate={onNavigate} />
    </div>
  );
};

export default VendorHomeScreen;