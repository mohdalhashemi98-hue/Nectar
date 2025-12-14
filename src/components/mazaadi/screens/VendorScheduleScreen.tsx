import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Clock, MapPin, Phone, 
  MessageSquare, User, CheckCircle, AlertCircle, Calendar as CalendarIcon,
  MoreVertical, Navigation, Star
} from 'lucide-react';
import { ScreenType } from '@/types/mazaadi';
import { CategoryIcon } from '../utils/categoryIcons';
import BottomNav from '../BottomNav';
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore } from 'date-fns';

interface ScheduledJob {
  id: number;
  title: string;
  category: string;
  customer: {
    name: string;
    phone: string;
    avatar: string;
    rating: number;
    memberSince: string;
  };
  location: string;
  address: string;
  timeSlot: string;
  startTime: string;
  endTime: string;
  date: Date;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  amount: number;
  notes?: string;
}

// Mock scheduled jobs data
const generateMockJobs = (): ScheduledJob[] => {
  const today = new Date();
  return [
    {
      id: 1,
      title: 'AC Deep Cleaning',
      category: 'AC & Ventilation',
      customer: {
        name: 'Mohammed Al-Rashid',
        phone: '+971 50 123 4567',
        avatar: 'MR',
        rating: 4.9,
        memberSince: 'Gold Member'
      },
      location: 'Dubai Marina',
      address: 'Marina Heights Tower, Apt 2304',
      timeSlot: 'Morning',
      startTime: '09:00',
      endTime: '11:00',
      date: today,
      status: 'upcoming',
      amount: 280,
      notes: '3 split units, customer will be home'
    },
    {
      id: 2,
      title: 'Emergency AC Repair',
      category: 'AC & Ventilation',
      customer: {
        name: 'Sara Al-Mansoori',
        phone: '+971 55 987 6543',
        avatar: 'SA',
        rating: 4.7,
        memberSince: 'Silver Member'
      },
      location: 'JBR',
      address: 'Sadaf 4, Unit 1205',
      timeSlot: 'Afternoon',
      startTime: '14:00',
      endTime: '16:00',
      date: today,
      status: 'in-progress',
      amount: 350
    },
    {
      id: 3,
      title: 'AC Installation - New Unit',
      category: 'AC & Ventilation',
      customer: {
        name: 'Ahmed Hassan',
        phone: '+971 52 555 1234',
        avatar: 'AH',
        rating: 5.0,
        memberSince: 'Platinum Member'
      },
      location: 'Downtown Dubai',
      address: 'Boulevard Point, Apt 4501',
      timeSlot: 'Morning',
      startTime: '10:00',
      endTime: '13:00',
      date: addDays(today, 1),
      status: 'upcoming',
      amount: 650,
      notes: 'Installing 2 ton split AC, customer requests quiet operation unit'
    },
    {
      id: 4,
      title: 'Quarterly AC Maintenance',
      category: 'AC & Ventilation',
      customer: {
        name: 'Fatima Al-Zahra',
        phone: '+971 50 444 7890',
        avatar: 'FZ',
        rating: 4.8,
        memberSince: 'Gold Member'
      },
      location: 'Business Bay',
      address: 'Executive Towers, Office 2201',
      timeSlot: 'Afternoon',
      startTime: '15:00',
      endTime: '17:00',
      date: addDays(today, 1),
      status: 'upcoming',
      amount: 200
    },
    {
      id: 5,
      title: 'Duct Cleaning - Villa',
      category: 'AC & Ventilation',
      customer: {
        name: 'Khalid Al-Maktoum',
        phone: '+971 56 777 3333',
        avatar: 'KM',
        rating: 4.6,
        memberSince: 'Gold Member'
      },
      location: 'Palm Jumeirah',
      address: 'Frond M, Villa 23',
      timeSlot: 'Morning',
      startTime: '08:00',
      endTime: '12:00',
      date: addDays(today, 2),
      status: 'upcoming',
      amount: 800,
      notes: 'Large villa, 8 ducts total'
    },
    {
      id: 6,
      title: 'AC Gas Top-up',
      category: 'AC & Ventilation',
      customer: {
        name: 'Layla Ibrahim',
        phone: '+971 54 222 8888',
        avatar: 'LI',
        rating: 4.9,
        memberSince: 'Silver Member'
      },
      location: 'Al Barsha',
      address: 'Al Barsha 1, Villa 45',
      timeSlot: 'Evening',
      startTime: '18:00',
      endTime: '19:00',
      date: addDays(today, 3),
      status: 'upcoming',
      amount: 180
    }
  ];
};

interface VendorScheduleScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

const VendorScheduleScreen = ({ onNavigate }: VendorScheduleScreenProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [selectedJob, setSelectedJob] = useState<ScheduledJob | null>(null);
  
  const scheduledJobs = useMemo(() => generateMockJobs(), []);
  
  // Get jobs for selected date
  const jobsForSelectedDate = useMemo(() => {
    return scheduledJobs
      .filter(job => isSameDay(job.date, selectedDate))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [scheduledJobs, selectedDate]);
  
  // Generate week days
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);
  
  // Get job count for a date
  const getJobCount = (date: Date) => {
    return scheduledJobs.filter(job => isSameDay(job.date, date)).length;
  };
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    setWeekStart(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const statusConfig = {
    'upcoming': { bg: 'bg-blue-500/10', text: 'text-blue-600', label: 'Upcoming' },
    'in-progress': { bg: 'bg-primary/10', text: 'text-primary', label: 'In Progress' },
    'completed': { bg: 'bg-green-500/10', text: 'text-green-600', label: 'Completed' },
    'cancelled': { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Cancelled' }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-golden text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
        
        <div className="px-6 py-5 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <button
              onClick={() => onNavigate('vendor-home')}
              className="w-10 h-10 rounded-2xl bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold">My Schedule</h1>
              <p className="text-sm opacity-80">{scheduledJobs.length} jobs this week</p>
            </div>
            <button className="p-2.5 bg-primary-foreground/20 rounded-xl">
              <CalendarIcon className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Week Navigator */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => navigateWeek('prev')}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <span className="font-semibold text-foreground">
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </span>
          <button 
            onClick={() => navigateWeek('next')}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
        
        {/* Week Days */}
        <div className="flex gap-1">
          {weekDays.map((day, idx) => {
            const jobCount = getJobCount(day);
            const isSelected = isSameDay(day, selectedDate);
            const isPast = isBefore(day, new Date()) && !isToday(day);
            
            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={`flex-1 py-2 rounded-xl text-center transition-all relative ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground' 
                    : isPast 
                      ? 'bg-secondary/50 text-muted-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                <div className="text-[10px] font-medium opacity-70">
                  {format(day, 'EEE')}
                </div>
                <div className={`text-lg font-bold ${isToday(day) && !isSelected ? 'text-primary' : ''}`}>
                  {format(day, 'd')}
                </div>
                {jobCount > 0 && (
                  <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    isSelected ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
                  }`}>
                    {jobCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Jobs List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-3">
        {jobsForSelectedDate.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="font-semibold text-foreground mb-2">No Jobs Scheduled</h3>
            <p className="text-sm text-muted-foreground">
              {isToday(selectedDate) ? "You have no jobs for today" : `No jobs on ${format(selectedDate, 'MMMM d')}`}
            </p>
          </motion.div>
        ) : (
          <>
            <div className="text-sm font-medium text-muted-foreground mb-2">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </div>
            
            {jobsForSelectedDate.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <button
                  onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                  className="w-full bg-card rounded-2xl border border-border overflow-hidden text-left transition-all hover:border-primary/30"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  {/* Time & Status Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-secondary/30 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">{job.startTime}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="font-semibold">{job.endTime}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({job.timeSlot})</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[job.status].bg} ${statusConfig[job.status].text}`}>
                      {statusConfig[job.status].label}
                    </span>
                  </div>
                  
                  {/* Job Details */}
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                        <CategoryIcon category={job.category} className="w-5 h-5 text-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground">{job.title}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{job.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{job.amount} AED</div>
                      </div>
                    </div>
                    
                    {/* Customer Info */}
                    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {job.customer.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground text-sm">{job.customer.name}</span>
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-primary fill-primary" />
                            <span className="text-xs text-foreground">{job.customer.rating}</span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{job.customer.memberSince}</span>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${selectedJob?.id === job.id ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </button>
                
                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedJob?.id === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-card border border-t-0 border-border rounded-b-2xl p-4 space-y-4 -mt-2">
                        {/* Full Address */}
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Address</label>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground">{job.address}</span>
                          </div>
                        </div>
                        
                        {/* Notes */}
                        {job.notes && (
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Customer Notes</label>
                            <div className="bg-secondary/50 rounded-xl p-3 text-sm text-foreground">
                              {job.notes}
                            </div>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-2">
                          <button className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors">
                            <Phone className="w-5 h-5 text-foreground" />
                            <span className="text-xs text-foreground">Call</span>
                          </button>
                          <button 
                            onClick={() => onNavigate('messages-list')}
                            className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
                          >
                            <MessageSquare className="w-5 h-5 text-foreground" />
                            <span className="text-xs text-foreground">Message</span>
                          </button>
                          <button className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors">
                            <Navigation className="w-5 h-5 text-foreground" />
                            <span className="text-xs text-foreground">Navigate</span>
                          </button>
                        </div>
                        
                        {/* Status Actions */}
                        {job.status === 'upcoming' && (
                          <div className="grid grid-cols-2 gap-2">
                            <button className="py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Start Job
                            </button>
                            <button className="py-3 bg-secondary text-foreground rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Reschedule
                            </button>
                          </div>
                        )}
                        
                        {job.status === 'in-progress' && (
                          <button className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </>
        )}
      </div>

      <BottomNav active="home" userType="vendor" onNavigate={onNavigate} />
    </div>
  );
};

export default VendorScheduleScreen;