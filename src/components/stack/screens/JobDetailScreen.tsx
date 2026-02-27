import { motion } from 'framer-motion';
import { 
  Phone, MessageSquare, Star, CheckCircle, Clock, 
  CreditCard, Calendar, Shield, AlertCircle, Timer, Package, Banknote
} from 'lucide-react';
import { Job, Vendor, ScreenType, UserType } from '@/types/stack';
import { Button } from '@/components/ui/button';
import { CategoryIcon } from '../utils/categoryIcons';
import { ScreenHeader } from '@/components/shared';

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
    case 'Completed': return { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Completed' };
    case 'In Progress': return { icon: Timer, color: 'text-primary', bg: 'bg-primary/10', label: 'In Progress' };
    case 'Pending': return { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending Offers' };
    case 'Awaiting Completion': return { icon: AlertCircle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Awaiting Completion' };
    default: return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted', label: status };
  }
};

const getPaymentStatusConfig = (status: string | null) => {
  switch (status) {
    case 'Paid': return { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Payment Complete' };
    case 'Escrow': return { icon: Shield, color: 'text-primary', bg: 'bg-primary/10', label: 'In Escrow (Protected)' };
    default: return { icon: CreditCard, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Awaiting Payment' };
  }
};

const JobDetailScreen = ({ job, vendor, userType, onBack, onNavigate, onStartChat }: JobDetailScreenProps) => {
  const statusConfig = getStatusConfig(job.status);
  const StatusIcon = statusConfig.icon;
  const paymentConfig = getPaymentStatusConfig(job.paymentStatus);
  const PaymentIcon = paymentConfig.icon;

  const timelineEvents = [
    { id: 1, title: 'Job Posted', date: job.date, completed: true, icon: Package },
    { id: 2, title: 'Vendor Assigned', date: job.vendor ? job.date : null, completed: !!job.vendor, icon: CheckCircle },
    { id: 3, title: 'Work Started', date: job.status !== 'Pending' ? job.date : null, completed: job.status === 'In Progress' || job.status === 'Awaiting Completion' || job.status === 'Completed', icon: Timer },
    { id: 4, title: 'Work Completed', date: job.completedDate, completed: job.status === 'Completed', icon: CheckCircle },
    { id: 5, title: 'Payment Released', date: job.paymentStatus === 'Paid' ? job.completedDate : null, completed: job.paymentStatus === 'Paid', icon: Banknote }
  ];

  const canReview = userType === 'consumer' && job.status === 'Completed' && !job.rated;

  return (
    <div className="flex flex-col h-screen bg-background">
      <ScreenHeader title="Job Details" subtitle={`#${job.id}`} onBack={onBack} />

      {/* Job Summary */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
            <CategoryIcon category={job.category} className="w-6 h-6 text-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">{job.title}</h2>
            <p className="text-sm text-muted-foreground">{job.category}</p>
          </div>
          {job.amount > 0 && (
            <div className="text-right">
              <div className="font-bold text-lg text-foreground">{job.amount}</div>
              <div className="text-xs text-muted-foreground">AED</div>
            </div>
          )}
        </div>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${statusConfig.bg}`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
          <span className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-32 space-y-5">
        {/* Vendor Info */}
        {job.vendor && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-elevated p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Service Provider</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground text-lg font-bold">
                {job.vendor.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{job.vendor}</h4>
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
              <button onClick={onStartChat} className="flex items-center justify-center gap-2 py-3 bg-secondary rounded-xl text-foreground font-medium hover:bg-secondary/80 transition-colors">
                <MessageSquare className="w-4 h-4" /> Message
              </button>
              {vendor?.phone && (
                <a href={`tel:${vendor.phone}`} className="flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-medium">
                  <Phone className="w-4 h-4" /> Call
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* Payment Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-elevated p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Payment Status</h3>
          <div className={`flex items-center gap-3 p-3 rounded-xl ${paymentConfig.bg}`}>
            <PaymentIcon className={`w-5 h-5 ${paymentConfig.color}`} />
            <div className="flex-1">
              <p className={`font-semibold ${paymentConfig.color}`}>{paymentConfig.label}</p>
              {job.paymentStatus === 'Escrow' && <p className="text-xs text-muted-foreground">Protected until job completion</p>}
            </div>
          </div>
          {job.pointsEarned > 0 && (
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Points earned</span>
              <span className="text-sm font-bold text-primary ml-auto">+{job.pointsEarned}</span>
            </div>
          )}
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-elevated p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">Job Timeline</h3>
          <div className="space-y-0">
            {timelineEvents.map((event, index) => {
              const EventIcon = event.icon;
              const isLast = index === timelineEvents.length - 1;
              return (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${event.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <EventIcon className="w-4 h-4" />
                    </div>
                    {!isLast && <div className={`w-0.5 h-10 ${event.completed ? 'bg-primary' : 'bg-border'}`} />}
                  </div>
                  <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                    <p className={`font-medium ${event.completed ? 'text-foreground' : 'text-muted-foreground'}`}>{event.title}</p>
                    {event.date && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> {event.date}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Rating */}
        {job.rated && job.rating > 0 && (
          <div className="card-elevated p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Your Review</h3>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-6 h-6 ${star <= job.rating ? 'fill-primary text-primary' : 'text-border'}`} />
              ))}
              <span className="ml-2 font-semibold text-foreground">{job.rating}/5</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      {canReview && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <Button onClick={() => onNavigate('review')} className="w-full bg-primary text-primary-foreground h-12 text-base font-semibold">
            <Star className="w-5 h-5 mr-2" /> Leave a Review
          </Button>
        </div>
      )}
      {userType === 'consumer' && job.paymentStatus !== 'Paid' && job.vendor && (job.status === 'In Progress' || job.status === 'Awaiting Completion') && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <Button onClick={() => onNavigate('payment')} className="w-full bg-primary text-primary-foreground h-12 text-base font-semibold">
            <CreditCard className="w-5 h-5 mr-2" /> View Payment & Progress
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobDetailScreen;
