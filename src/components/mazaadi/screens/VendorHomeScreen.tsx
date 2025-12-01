import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Settings, DollarSign, Briefcase, MapPin, Clock, ChevronRight, Zap, TrendingUp, Users, Calendar, Target, Award, BarChart3, MessageSquare, ThumbsUp } from 'lucide-react';
import { VendorStats, AvailableJob, ScreenType } from '@/types/mazaadi';
import BottomNav from '../BottomNav';
import { VendorHomeSkeleton } from '../ScreenSkeleton';
import { CategoryIcon } from '../utils/categoryIcons';
import nectarLogo from '@/assets/nectar-logo.png';

// Mock customer reviews data
const customerReviews = [
  {
    id: 1,
    customerName: 'Mohammed K.',
    rating: 5,
    comment: 'Excellent AC service! Ahmad was professional, arrived on time, and fixed the issue quickly. Highly recommend!',
    date: '2 days ago',
    service: 'AC Maintenance',
    helpful: 12
  },
  {
    id: 2,
    customerName: 'Sara M.',
    rating: 5,
    comment: 'Great work on the installation. Very knowledgeable and cleaned up after the job.',
    date: '1 week ago',
    service: 'AC Installation',
    helpful: 8
  },
  {
    id: 3,
    customerName: 'Ali R.',
    rating: 4,
    comment: 'Good service overall. Would have appreciated a bit more communication during the repair.',
    date: '2 weeks ago',
    service: 'AC Repair',
    helpful: 5
  }
];

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
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-primary-foreground/10 rounded-full blur-2xl" />
      
      <div className="px-6 py-5 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-5"
        >
          <div className="flex items-center gap-3">
            <img src={nectarLogo} alt="Nectar" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="font-display text-2xl font-bold mb-1">Ahmad Al-Mansouri</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-primary-foreground/20 px-2 py-0.5 rounded-lg">
                  <Star className="w-4 h-4 fill-primary-foreground text-primary-foreground" />
                  <span className="font-bold">{vendorStats.rating}</span>
                </div>
                <span className="opacity-70">({vendorStats.reviews} reviews)</span>
              </div>
            </div>
          </div>
          <button onClick={() => onNavigate('profile')} className="p-3 bg-primary-foreground/20 rounded-3xl hover:bg-primary-foreground/30 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Main Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { value: vendorStats.totalJobs, label: 'Jobs Done', icon: Briefcase },
            { value: `${(vendorStats.totalEarnings / 1000).toFixed(0)}K`, label: 'AED Earned', icon: DollarSign },
            { value: `${vendorStats.completionRate}%`, label: 'Success', icon: Target }
          ].map((stat, idx) => (
            <div key={idx} className="bg-primary-foreground/20 backdrop-blur-xl rounded-3xl p-3 text-center border border-primary-foreground/10">
              <div className="w-8 h-8 mx-auto mb-1 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="font-display text-xl font-bold">{stat.value}</div>
              <div className="text-xs opacity-70">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 overflow-y-auto px-6 py-5 pb-24 space-y-6">
      {/* Monthly Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          This Month's Performance
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-xs text-muted-foreground">Earnings</div>
            </div>
            <div className="font-display text-xl font-bold text-foreground">
              {vendorStats.thisMonth.earnings.toLocaleString()} AED
            </div>
            <div className="text-xs text-success font-medium mt-1">↑ 12% from last month</div>
          </div>
          
          <div className="card-elevated p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-xs text-muted-foreground">Jobs Done</div>
            </div>
            <div className="font-display text-xl font-bold text-foreground">
              {vendorStats.thisMonth.jobs} Jobs
            </div>
            <div className="text-xs text-success font-medium mt-1">↑ 8% from last month</div>
          </div>
        </div>
      </motion.div>

      {/* Additional Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { icon: Users, value: '45', label: 'Repeat Clients' },
          { icon: Award, value: '12', label: '5-Star Reviews' },
          { icon: Calendar, value: '3', label: 'This Week' }
        ].map((stat, idx) => (
          <div key={idx} className="stat-card text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-secondary rounded-lg flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-foreground" />
            </div>
            <div className="font-display text-lg font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Weekly Trend */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="card-elevated p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-display font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Weekly Earnings
          </h4>
          <span className="text-xs text-success font-medium">+18% vs last week</span>
        </div>
        <div className="flex items-end gap-2 h-16">
          {[40, 65, 45, 80, 55, 90, 70].map((height, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.3 + idx * 0.05, duration: 0.4 }}
                className={`w-full rounded-t-lg ${idx === 5 ? 'bg-primary' : 'bg-primary/20'}`}
              />
              <span className="text-[10px] text-muted-foreground">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Customer Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Customer Reviews
          </h3>
          <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-bold text-primary">{vendorStats.rating}</span>
            <span className="text-xs text-muted-foreground">({vendorStats.reviews})</span>
          </div>
        </div>
        
        {/* Rating Breakdown */}
        <div className="card-elevated p-4 mb-4">
          <div className="grid grid-cols-5 gap-2 mb-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const percentage = stars === 5 ? 78 : stars === 4 ? 15 : stars === 3 ? 5 : stars === 2 ? 1 : 1;
              return (
                <div key={stars} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">{stars}★</div>
                  <div className="h-12 bg-secondary rounded-lg relative overflow-hidden">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${percentage}%` }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-lg"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{percentage}%</div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Based on {vendorStats.reviews} reviews</span>
            <span className="text-primary font-medium">Top Rated Pro</span>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="space-y-3">
          {customerReviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + idx * 0.05 }}
              className="card-elevated p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-foreground">
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{review.customerName}</div>
                    <div className="text-xs text-muted-foreground">{review.service}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{review.date}</div>
              </div>
              
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= review.rating ? 'fill-primary text-primary' : 'text-border'}`} 
                  />
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
              
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ThumbsUp className="w-3 h-3" />
                  Helpful ({review.helpful})
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Available Jobs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-foreground">Available Jobs</h3>
          <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
            {availableJobs.length} new
          </span>
        </div>
        <div className="space-y-3">
          {availableJobs.map((job, idx) => (
            <motion.button
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + idx * 0.05 }}
              whileHover={{ y: -2 }}
              onClick={() => { onSelectJob(job); onNavigate('request-detail'); }}
              className="card-interactive w-full p-4 text-left group"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <CategoryIcon category={job.category} className="w-5 h-5 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground truncate">{job.title}</h4>
                    {job.urgent && (
                      <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold flex items-center gap-1 flex-shrink-0">
                        <Zap className="w-3 h-3" />
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{job.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-foreground transition-colors" />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground pl-13">
                <span className="font-bold text-foreground">{job.budget}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.distance}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.time}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>

    <BottomNav active="home" userType="vendor" onNavigate={onNavigate} />
  </div>
  );
};

export default VendorHomeScreen;