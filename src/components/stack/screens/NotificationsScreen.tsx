import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Gift, MessageCircle, Flame, CheckCircle, CreditCard, Bell, Clock, Send } from 'lucide-react';
import { ScreenType, Notification } from '@/types/stack';
import BottomNav from '../BottomNav';
import StackPattern from '../StackPattern';
import { Button } from '@/components/ui/button';
import { useSendSystemNotification } from '@/hooks/use-data-queries';
import { toast } from 'sonner';
interface NotificationsScreenProps {
  notifications: Notification[];
  userType: 'consumer' | 'vendor' | null;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'offer':
      return Briefcase;
    case 'reward':
      return Gift;
    case 'message':
      return MessageCircle;
    case 'job':
      return CheckCircle;
    case 'payment':
      return CreditCard;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'offer':
      return 'bg-blue-500/20 text-blue-500';
    case 'reward':
      return 'bg-primary/20 text-primary';
    case 'message':
      return 'bg-green-500/20 text-green-500';
    case 'job':
      return 'bg-emerald-500/20 text-emerald-500';
    case 'payment':
      return 'bg-purple-500/20 text-purple-500';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const NotificationsScreen = ({ notifications, userType, onBack, onNavigate, onSelectJobForQuotes }: NotificationsScreenProps & { onSelectJobForQuotes?: (jobId: number) => void }) => {
  const unreadCount = notifications.filter(n => n.unread).length;
  const sendNotification = useSendSystemNotification();

  const handleTestNotification = async () => {
    const testTypes = [
      { type: 'job_status' as const, title: 'Job Status Updated', message: 'Your plumbing job has been marked as in progress' },
      { type: 'quote_received' as const, title: 'New Quote Received', message: 'A vendor has submitted a quote for your job' },
      { type: 'message' as const, title: 'New Message', message: 'You have a new message from your vendor' },
      { type: 'job_completed' as const, title: 'Job Completed', message: 'Your job has been marked as complete!' },
      { type: 'payment' as const, title: 'Payment Confirmed', message: 'Your payment of $150 has been processed' },
      { type: 'system' as const, title: 'System Update', message: 'Welcome to Stack! Check out our new features.' },
    ];
    
    const randomTest = testTypes[Math.floor(Math.random() * testTypes.length)];
    
    try {
      await sendNotification.mutateAsync(randomTest);
      toast.success('Test notification sent!');
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error('Failed to send notification. Make sure you are logged in.');
    }
  };

  const handleNotificationTap = (notification: Notification) => {
    // Handle navigation based on notification type
    if (notification.type === 'offer' && onSelectJobForQuotes) {
      // Navigate to quote management for offer notifications
      onSelectJobForQuotes(3); // Job ID 3 is "Painting Service" with offers
      onNavigate('quote-management');
    } else if (notification.type === 'message') {
      onNavigate('messages-list');
    } else if (notification.type === 'job') {
      onNavigate('transactions');
    } else if (notification.type === 'payment') {
      onNavigate('transactions');
    } else if (notification.type === 'reward') {
      onNavigate('rewards');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground relative overflow-hidden">
        <StackPattern opacity="0.08" color="ffffff" className="absolute inset-0" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        
        <div className="px-4 py-5 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <button onClick={onBack} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold">Notifications</h1>
              <p className="text-primary-foreground/60 text-sm">
                {unreadCount > 0 ? `${unreadCount} new updates` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">{unreadCount}</span>
              </div>
            )}
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
              onClick={handleTestNotification}
              disabled={sendNotification.isPending}
            >
              <Send className="w-4 h-4 mr-1" />
              {sendNotification.isPending ? 'Sending...' : 'Test'}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

          {/* Notifications */}
          <div className="space-y-4">
            {notifications.map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type);

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-12"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Notification card */}
                  <div 
                    className={`card-elevated p-4 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all ${notification.unread ? 'ring-2 ring-primary/30' : ''}`}
                    onClick={() => handleNotificationTap(notification)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {notification.title}
                          </h3>
                          {notification.unread && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      {notification.type === 'offer' && (
                        <div className="flex-shrink-0 px-2 py-1 bg-primary/10 rounded-lg">
                          <span className="text-xs font-semibold text-primary">View Quotes</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {notification.time}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {notifications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">No notifications</h3>
              <p className="text-sm text-muted-foreground">You're all caught up!</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        userType={userType}
        active="notifications"
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default NotificationsScreen;
