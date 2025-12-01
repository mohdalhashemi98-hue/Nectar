import { motion } from 'framer-motion';
import { 
  ArrowLeft, Phone, MessageSquare, Star, CheckCircle, Clock, 
  CreditCard, Calendar, Shield, AlertCircle,
  Timer, Package, Banknote
} from 'lucide-react';
import { Job, Vendor, ScreenType, UserType } from '@/types/mazaadi';
import { Button } from '@/components/ui/button';
import { CategoryIcon } from '../utils/categoryIcons';


interface JobDetailScreenProps {
  job: Job;
  vendor?: Vendor | null;
  userType: UserType;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onStartChat: () => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'Completed':
      return { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Completed' };
    case 'In Progress':
      return { icon: Timer, color: 'text-primary', bg: 'bg-primary/10', label: 'In Progress' };
    case 'Pending':
      return { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending Offers' };
    case 'Awaiting Completion':
      return { icon: AlertCircle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Awaiting Completion' };
    default:
      return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted', label: status };
  }
};

const getPaymentStatusConfig = (status: string | null) => {
  switch (status) {
    case 'Paid':
      return { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Payment Complete' };
    case 'Escrow':
      return { icon: Shield, color: 'text-primary', bg: 'bg-primary/10', label: 'In Escrow (Protected)' };
    default:
      return { icon: CreditCard, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Awaiting Payment' };
  }
};

const JobDetailScreen = ({ job, vendor, userType, onBack, onNavigate, onStartChat }: JobDetailScreenProps) => {
  const statusConfig = getStatusConfig(job.status);
  const StatusIcon = statusConfig.icon;
  const paymentConfig = getPaymentStatusConfig(job.paymentStatus);
  const PaymentIcon = paymentConfig.icon;

  const timelineEvents = [
    { 
      id: 1, 
      title: 'Job Posted', 
      date: job.date, 
      completed: true, 
      icon: Package 
    },
    { 
      id: 2, 
      title: 'Vendor Assigned', 
      date: job.vendor ? job.date : null, 
      completed: !!job.vendor, 
      icon: CheckCircle 
    },
    { 
      id: 3, 
      title: 'Work Started', 
      date: job.status !== 'Pending' ? job.date : null, 
      completed: job.status === 'In Progress' || job.status === 'Awaiting Completion' || job.status === 'Completed', 
      icon: Timer 
    },
    { 
      id: 4, 
      title: 'Work Completed', 
      date: job.completedDate, 
      completed: job.status === 'Completed', 
      icon: CheckCircle 
    },
    { 
      id: 5, 
      title: 'Payment Released', 
      date: job.paymentStatus === 'Paid' ? job.completedDate : null, 
      completed: job.paymentStatus === 'Paid', 
      icon: Banknote 
    }
  ];

  const canReview = userType === 'consumer' && job.status === 'Completed' && !job.rated;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        
        <div className="px-6 py-5 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <button onClick={onBack} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold">Job Details</h1>
              <p className="text-primary-foreground/60 text-sm">#{job.id}</p>
            </div>
          </motion.div>

          {/* Job Summary Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/15 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <CategoryIcon category={job.category} className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{job.title}</h2>
                <p className="text-primary-foreground/60 text-sm">{job.category}</p>
              </div>
              {job.amount > 0 && (
                <div className="text-right">
                  <div className="font-display text-2xl font-bold">{job.amount}</div>
                  <div className="text-xs opacity-60">AED</div>
                </div>
              )}
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig.bg}`}>
              <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
              <span className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 pb-32 space-y-5">
        {/* Vendor Info */}
        {job.vendor && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-elevated p-4"
          >
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide text-muted-foreground">Service Provider</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-xl font-bold">
                {job.vendor.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{job.vendor}</h4>
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  </div>
                </div>
                {vendor && (
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-sm font-medium">{vendor.rating}</span>
                    <span className="text-sm text-muted-foreground">({vendor.reviews} reviews)</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={onStartChat}
                className="flex items-center justify-center gap-2 py-3 bg-secondary rounded-xl text-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
              {vendor?.phone && (
                <a 
                  href={`tel:${vendor.phone}`}
                  className="flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* Payment Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-4"
        >
          <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide text-muted-foreground">Payment Status</h3>
          <div className={`flex items-center gap-3 p-3 rounded-xl ${paymentConfig.bg}`}>
            <div className={`w-10 h-10 rounded-xl ${paymentConfig.bg} flex items-center justify-center`}>
              <PaymentIcon className={`w-5 h-5 ${paymentConfig.color}`} />
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${paymentConfig.color}`}>{paymentConfig.label}</p>
              {job.paymentStatus === 'Escrow' && (
                <p className="text-xs text-muted-foreground">Your payment is protected until job completion</p>
              )}
              {job.paymentStatus === 'Paid' && job.amount > 0 && (
                <p className="text-xs text-muted-foreground">{job.amount} AED released to vendor</p>
              )}
            </div>
          </div>
          
          {job.pointsEarned > 0 && (
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-sm">🪙</span>
              </div>
              <span className="text-sm text-muted-foreground">Points earned</span>
              <span className="text-sm font-bold text-primary ml-auto">+{job.pointsEarned}</span>
            </div>
          )}
        </motion.div>

        {/* Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card-elevated p-4"
        >
          <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide text-muted-foreground">Job Timeline</h3>
          <div className="space-y-0">
            {timelineEvents.map((event, index) => {
              const EventIcon = event.icon;
              const isLast = index === timelineEvents.length - 1;
              
              return (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.completed 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <EventIcon className="w-4 h-4" />
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-10 ${
                        event.completed ? 'bg-primary' : 'bg-border'
                      }`} />
                    )}
                  </div>
                  <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                    <p className={`font-medium ${event.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {event.title}
                    </p>
                    {event.date && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Rating (if rated) */}
        {job.rated && job.rating > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-elevated p-4"
          >
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide text-muted-foreground">Your Review</h3>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= job.rating ? 'fill-primary text-primary' : 'text-border'
                  }`}
                />
              ))}
              <span className="ml-2 font-semibold text-foreground">{job.rating}/5</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Action */}
      {canReview && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent max-w-md mx-auto">
          <Button
            onClick={() => onNavigate('review')}
            className="w-full bg-gradient-golden text-primary-foreground hover:opacity-90 h-12 text-base font-semibold"
          >
            <Star className="w-5 h-5 mr-2" />
            Leave a Review & Earn 50 pts
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobDetailScreen;