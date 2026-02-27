import { motion } from 'framer-motion';
import { Briefcase, Gift, MessageCircle, CheckCircle, CreditCard, Bell, Clock, Send } from 'lucide-react';
import { ScreenType, Notification } from '@/types/stack';
import BottomNav from '../BottomNav';
import { ScreenHeader } from '@/components/shared';
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
    case 'offer': return Briefcase;
    case 'reward': return Gift;
    case 'message': return MessageCircle;
    case 'job': return CheckCircle;
    case 'payment': return CreditCard;
    default: return Bell;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'offer': return 'bg-primary/10 text-primary';
    case 'reward': return 'bg-primary/10 text-primary';
    case 'message': return 'bg-success/10 text-success';
    case 'job': return 'bg-success/10 text-success';
    case 'payment': return 'bg-primary/10 text-primary';
    default: return 'bg-muted text-muted-foreground';
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
    ];
    const randomTest = testTypes[Math.floor(Math.random() * testTypes.length)];
    try {
      await sendNotification.mutateAsync(randomTest);
      toast.success('Test notification sent!');
    } catch (error) {
      toast.error('Failed to send notification. Make sure you are logged in.');
    }
  };

  const handleNotificationTap = (notification: Notification) => {
    if (notification.type === 'offer' && onSelectJobForQuotes) {
      onSelectJobForQuotes(3);
      onNavigate('quote-management');
    } else if (notification.type === 'message') {
      onNavigate('messages-list');
    } else if (notification.type === 'job' || notification.type === 'payment') {
      onNavigate('transactions');
    } else if (notification.type === 'reward') {
      onNavigate('rewards');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ScreenHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} new updates` : 'All caught up!'}
        onBack={onBack}
        icon={Bell}
        rightAction={
          <Button
            size="sm"
            variant="outline"
            onClick={handleTestNotification}
            disabled={sendNotification.isPending}
          >
            <Send className="w-4 h-4 mr-1" />
            {sendNotification.isPending ? '...' : 'Test'}
          </Button>
        }
      />

      {/* Timeline */}
      <div className="px-4 py-5 pb-24 flex-1 overflow-y-auto">
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

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
                  <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div 
                    className={`card-elevated p-4 cursor-pointer hover:border-primary/20 transition-all ${notification.unread ? 'border-primary/30' : ''}`}
                    onClick={() => handleNotificationTap(notification)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{notification.title}</h3>
                          {notification.unread && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                      </div>
                      {notification.type === 'offer' && (
                        <div className="flex-shrink-0 px-2 py-1 bg-primary/10 rounded-lg">
                          <span className="text-xs font-semibold text-primary">View</span>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">No notifications</h3>
              <p className="text-sm text-muted-foreground">You're all caught up!</p>
            </motion.div>
          )}
        </div>
      </div>

      <BottomNav userType={userType} active="notifications" onNavigate={onNavigate} />
    </div>
  );
};

export default NotificationsScreen;
