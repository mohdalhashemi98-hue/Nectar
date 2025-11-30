import { motion } from 'framer-motion';
import { ArrowLeft, Star, Heart, MapPin, Clock, CheckCircle, MessageCircle, Phone, Briefcase, Award, Shield } from 'lucide-react';
import { Vendor, ScreenType, Conversation } from '@/types/mazaadi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VendorProfileScreenProps {
  vendor: Vendor;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onStartChat: (conversation: Conversation) => void;
}

const VendorProfileScreen = ({ vendor, onBack, onNavigate, onStartChat }: VendorProfileScreenProps) => {
  const handleContact = () => {
    const newConversation: Conversation = {
      id: Date.now(),
      name: vendor.name,
      avatar: vendor.avatar,
      lastMessage: 'Start a conversation...',
      time: 'Now',
      unread: false,
      online: true,
      messages: []
    };
    onStartChat(newConversation);
    onNavigate('chat');
  };

  const handleHireNow = () => {
    toast.success(`Hiring request sent to ${vendor.name}!`);
    onNavigate('post-request');
  };

  const handleToggleFavorite = () => {
    toast.success(vendor.favorite ? 'Removed from favorites' : 'Added to favorites');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background relative overflow-hidden pb-24">
        <div className="absolute top-0 right-0 w-40 h-40 bg-background/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-background/5 rounded-full blur-2xl" />
        
        <div className="px-6 py-5 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <button onClick={onBack} className="p-2 bg-background/10 rounded-xl hover:bg-background/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleToggleFavorite}
              className="p-2 bg-background/10 rounded-xl hover:bg-background/20 transition-colors"
            >
              <Heart className={`w-5 h-5 ${vendor.favorite ? 'fill-current' : ''}`} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Profile Card - Floating */}
      <div className="px-6 -mt-20 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-6 border border-border"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-2xl font-bold text-foreground">
              {vendor.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-xl font-bold text-foreground">{vendor.name}</h1>
                {vendor.verified && (
                  <div className="w-5 h-5 bg-foreground rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-background" />
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-sm">{vendor.specialty}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-foreground fill-foreground" />
                <span className="font-bold text-foreground">{vendor.rating}</span>
                <span className="text-muted-foreground text-sm">({vendor.reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-secondary rounded-xl p-3 text-center">
              <div className="font-bold text-foreground">{vendor.completedJobs}</div>
              <div className="text-xs text-muted-foreground">Jobs Done</div>
            </div>
            <div className="bg-secondary rounded-xl p-3 text-center">
              <div className="font-bold text-foreground">{vendor.completionRate}%</div>
              <div className="text-xs text-muted-foreground">Completion</div>
            </div>
            <div className="bg-secondary rounded-xl p-3 text-center">
              <div className="font-bold text-foreground">{vendor.responseTime}</div>
              <div className="text-xs text-muted-foreground">Response</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleContact}
              variant="outline" 
              className="flex-1 border-foreground/20 hover:bg-secondary"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button 
              onClick={handleHireNow}
              className="flex-1 bg-foreground text-background hover:bg-foreground/90"
            >
              Hire Now
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {/* Details */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-4"
        >
          <h3 className="font-semibold text-foreground mb-3">Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Distance</div>
                <div className="font-medium text-foreground">{vendor.distance}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Average Price</div>
                <div className="font-medium text-foreground">{vendor.avgPrice}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Job</div>
                <div className="font-medium text-foreground">{vendor.lastJob} • {vendor.lastJobDate}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-elevated p-4"
        >
          <h3 className="font-semibold text-foreground mb-3">Badges & Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {vendor.verified && (
              <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-xl">
                <Shield className="w-4 h-4 text-foreground" />
                <span className="text-sm font-medium text-foreground">Verified Pro</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-xl">
              <Award className="w-4 h-4 text-foreground" />
              <span className="text-sm font-medium text-foreground">Top Rated</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-xl">
              <Clock className="w-4 h-4 text-foreground" />
              <span className="text-sm font-medium text-foreground">Fast Response</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Work */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-4"
        >
          <h3 className="font-semibold text-foreground mb-3">Recent Work</h3>
          <div className="space-y-3">
            {[
              { title: vendor.lastJob, date: vendor.lastJobDate, rating: 5 },
              { title: 'Maintenance Service', date: '1 month ago', rating: 5 },
              { title: 'Emergency Repair', date: '2 months ago', rating: 4 },
            ].map((work, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="font-medium text-foreground text-sm">{work.title}</div>
                  <div className="text-xs text-muted-foreground">{work.date}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-foreground fill-foreground" />
                  <span className="text-sm font-bold text-foreground">{work.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Action */}
      <div className="p-6 bg-gradient-to-t from-background via-background to-transparent">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 border-foreground/20"
            onClick={() => window.open(`tel:${vendor.phone}`)}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button 
            onClick={handleHireNow}
            className="flex-1 bg-foreground text-background hover:bg-foreground/90"
          >
            Quick Hire
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileScreen;
