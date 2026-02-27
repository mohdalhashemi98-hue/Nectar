import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Star, Bell, Briefcase, MapPin, Clock, ChevronRight, Zap, TrendingUp,
  TrendingDown, Calendar, Target, BarChart3, MessageSquare,
  Wallet, Settings, Sparkles, ArrowUpRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { VendorStats, AvailableJob, ScreenType } from '@/types/stack';
import { generateEarningsTrendData, type TimeRange } from '@/data/chart-data';
import ValueChart from '../charts/ValueChart';
import BottomNav from '../BottomNav';
import { VendorHomeSkeleton } from '../ScreenSkeleton';
import { CategoryIcon } from '../utils/categoryIcons';
import AvailabilityToggle from '../AvailabilityToggle';
import { ThemeToggle } from '@/components/theme-toggle';
import PullToRefresh from '../PullToRefresh';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { VendorRefreshSkeleton } from '../RefreshSkeleton';

const priorityActions = {
  newRequests: 3,
  unreadMessages: 1,
  todaysBookings: 2
};

const kpiData = {
  conversionRate: { value: 18, change: 2, direction: 'up' as const },
  responseTime: { value: 12, change: -3, direction: 'down' as const, benchmark: 15 },
  satisfaction: { value: 4.8, reviews: 156 }
};

const highProbabilityLeads = [
  { id: 101, title: 'AC Deep Cleaning - Villa', category: 'AC & Ventilation', estimatedPayout: '280-350 AED', winProbability: 85, distance: '2.1 km', urgent: true, postedAgo: '5 min ago' },
  { id: 102, title: 'Split AC Installation', category: 'AC & Ventilation', estimatedPayout: '450-600 AED', winProbability: 78, distance: '3.5 km', urgent: false, postedAgo: '12 min ago' },
  { id: 103, title: 'Emergency AC Repair', category: 'AC & Ventilation', estimatedPayout: '200-300 AED', winProbability: 72, distance: '4.2 km', urgent: true, postedAgo: '18 min ago' }
];

const aiPriceInsight = { yourQuote: 200, benchmarkPrice: 185, difference: '+15%', adjustedWinChance: 30 };

interface VendorHomeScreenProps {
  vendorStats: VendorStats;
  availableJobs: AvailableJob[];
  onNavigate: (screen: ScreenType) => void;
  onSelectJob: (job: AvailableJob) => void;
}

const VendorHomeScreen = ({ vendorStats, availableJobs, onNavigate, onSelectJob }: VendorHomeScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [earningsRange, setEarningsRange] = useState<TimeRange>('1M');
  const earningsChart = useMemo(() => generateEarningsTrendData(vendorStats.totalEarnings, earningsRange), [vendorStats.totalEarnings, earningsRange]);

  const handleRefresh = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, []);

  const { pullDistance, isRefreshing, isPulling, handlers, containerRef } = usePullToRefresh({ onRefresh: handleRefresh });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <VendorHomeSkeleton />;

  return (
    <div className="w-full bg-background pb-24">
      {/* Header */}
      <div className="bg-background border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">AM</div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">Ahmad Al-Mansouri</h1>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Star className="w-3.5 h-3.5 text-amber fill-amber" />
                <span>{vendorStats.rating} · {vendorStats.reviews} reviews</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <button onClick={() => onNavigate('notifications')} className="relative p-2.5 rounded-xl hover:bg-secondary transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {(priorityActions.newRequests + priorityActions.unreadMessages) > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              )}
            </button>
            <button onClick={() => onNavigate('profile')} className="p-2.5 rounded-xl hover:bg-secondary transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <PullToRefresh ref={containerRef} pullDistance={pullDistance} isRefreshing={isRefreshing} isPulling={isPulling}
        handlers={handlers} className="flex-1" refreshSkeleton={<VendorRefreshSkeleton />}>
        <div className="px-4 py-4 space-y-5">
          {/* Availability */}
          <AvailabilityToggle initialAvailable={isAvailable} onToggle={setIsAvailable} />

          {/* Priority Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => onNavigate('transactions')} className="bg-card border border-border rounded-xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
                  {priorityActions.newRequests}
                </span>
              </div>
              <div className="text-xs font-medium text-foreground">Requests</div>
            </button>
            <button onClick={() => onNavigate('messages-list')} className="bg-card border border-border rounded-xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <span className="w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center">
                  {priorityActions.unreadMessages}
                </span>
              </div>
              <div className="text-xs font-medium text-foreground">Chats</div>
            </button>
            <button onClick={() => onNavigate('transactions')} className="bg-card border border-border rounded-xl p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-success" />
                </div>
                <span className="w-5 h-5 bg-success text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {priorityActions.todaysBookings}
                </span>
              </div>
              <div className="text-xs font-medium text-foreground">Today</div>
            </button>
          </div>

          {/* Performance */}
          <div>
            <h3 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Performance
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-card rounded-xl border border-border p-3 text-center">
                <div className="font-display text-lg font-bold text-foreground">{kpiData.conversionRate.value}%</div>
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-[10px] text-success">+{kpiData.conversionRate.change}%</span>
                </div>
                <div className="text-[10px] text-muted-foreground">Conversion</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-3 text-center">
                <div className="font-display text-lg font-bold text-foreground">{kpiData.responseTime.value}m</div>
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <TrendingDown className="w-3 h-3 text-success" />
                  <span className="text-[10px] text-success">{kpiData.responseTime.change}m</span>
                </div>
                <div className="text-[10px] text-muted-foreground">Response</div>
              </div>
              <button onClick={() => onNavigate('profile')} className="bg-card rounded-xl border border-border p-3 text-center">
                <div className="font-display text-lg font-bold text-foreground flex items-center justify-center gap-1">
                  {kpiData.satisfaction.value} <Star className="w-3 h-3 text-amber fill-amber" />
                </div>
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <CheckCircle2 className="w-3 h-3 text-success" />
                  <span className="text-[10px] text-success">Consistent</span>
                </div>
                <div className="text-[10px] text-muted-foreground">CSAT</div>
              </button>
            </div>
          </div>

          {/* Earnings Trend */}
          <div className="card-elevated p-4">
            <h3 className="font-display text-base font-bold text-foreground mb-2 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" /> Earnings
            </h3>
            <ValueChart
              data={earningsChart.points}
              summary={earningsChart.summary}
              label="Revenue"
              valueSuffix=" AED"
              selectedRange={earningsRange}
              onRangeChange={setEarningsRange}
              compact
              height={100}
            />
          </div>

          {/* AI Price Check */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground text-sm">AI Price Check</h4>
                <p className="text-xs text-muted-foreground">Your AC Repair pricing</p>
              </div>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 mb-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your Quote</span>
                <span className="font-medium text-foreground">{aiPriceInsight.yourQuote} AED</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Benchmark</span>
                <span className="font-medium text-primary">{aiPriceInsight.benchmarkPrice} AED</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-warning" />
                <span className="text-xs text-foreground">
                  <span className="font-medium text-warning">{aiPriceInsight.difference}</span> above benchmark
                </span>
              </div>
            </div>
            <button onClick={() => onNavigate('market-benchmark')}
              className="w-full flex items-center justify-center gap-2 py-2 text-primary text-sm font-medium hover:bg-primary/5 rounded-xl transition-colors">
              View Market Analysis <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Leads */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base font-bold text-foreground">Top Leads</h3>
              <button onClick={() => onNavigate('transactions')} className="text-sm text-primary">View All</button>
            </div>
            <div className="space-y-2">
              {highProbabilityLeads.map((lead) => (
                <button
                  key={lead.id}
                  className="w-full bg-card rounded-xl border border-border p-3 text-left"
                  onClick={() => {
                    const job = availableJobs.find(j => j.id === lead.id) || {
                      id: lead.id, title: lead.title, budget: lead.estimatedPayout, distance: lead.distance,
                      time: lead.postedAgo, urgent: lead.urgent, category: lead.category, description: '',
                      client: { name: 'Customer', member: 'Gold Member' }
                    };
                    onSelectJob(job as AvailableJob);
                    onNavigate('request-detail');
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                        <CategoryIcon category={lead.category} className="w-4 h-4 text-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-medium text-foreground text-sm">{lead.title}</h4>
                          {lead.urgent && (
                            <span className="px-1 py-0.5 bg-warning/10 text-warning rounded text-[10px] font-bold flex items-center gap-0.5">
                              <Zap className="w-2.5 h-2.5" /> URGENT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{lead.distance}</span>
                          <span>{lead.postedAgo}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">{lead.estimatedPayout}</div>
                      <div className="flex items-center gap-1 justify-end">
                        <div className="w-1.5 h-1.5 rounded-full bg-success" />
                        <span className="text-[10px] text-success">{lead.winProbability}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium flex items-center justify-center gap-1">
                    Quote Now <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h3 className="font-display text-base font-bold text-foreground mb-3">Quick Access</h3>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => onNavigate('vendor-schedule')} className="bg-card rounded-xl border border-border p-3 text-center">
                <div className="w-10 h-10 mx-auto mb-2 bg-secondary rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-foreground" />
                </div>
                <div className="text-xs font-medium text-foreground">Schedule</div>
              </button>
              <button onClick={() => onNavigate('company-profile')} className="bg-card rounded-xl border border-border p-3 text-center">
                <div className="w-10 h-10 mx-auto mb-2 bg-secondary rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-foreground" />
                </div>
                <div className="text-xs font-medium text-foreground">Services</div>
              </button>
              <button onClick={() => onNavigate('transactions')} className="bg-card rounded-xl border border-border p-3 text-center">
                <div className="w-10 h-10 mx-auto mb-2 bg-secondary rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-foreground" />
                </div>
                <div className="text-xs font-medium text-foreground">Payouts</div>
              </button>
            </div>
          </div>
        </div>
      </PullToRefresh>

      <BottomNav active="home" userType="vendor" onNavigate={onNavigate} />
    </div>
  );
};

export default VendorHomeScreen;
