import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Star, Heart, MapPin, Clock, CheckCircle, MessageCircle, 
  Phone, Briefcase, Award, Shield, Play, ChevronRight, Zap, Users,
  ThumbsUp, Image as ImageIcon, Quote, TrendingUp, Timer, Target,
  Sparkles, ExternalLink
} from 'lucide-react';
import { Vendor, ScreenType, Conversation } from '@/types/mazaadi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VendorProfileScreenProps {
  vendor: Vendor;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onStartChat: (conversation: Conversation) => void;
}

// Enhanced vendor data for marketing page
const vendorMarketingData = {
  coverVideo: null, // URL or null for image fallback
  coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
  tagline: 'Experts in European A/C Systems Since 2018',
  story: 'We are a family-owned AC service company serving Dubai and the greater UAE since 2018. Specializing in European climate systems (Daikin, Mitsubishi, Carrier), we bring German precision and Middle Eastern hospitality to every job. Our mission? To keep you cool, comfortable, and worry-free.',
  usps: [
    'Same-day emergency service',
    'All major European brands certified',
    'Eco-friendly cleaning solutions'
  ],
  services: [
    { name: 'AC Deep Clean', price: 'From 199 AED', benefit: 'Breathe cleaner air and reduce utility bills by up to 20%' },
    { name: 'Split AC Installation', price: '450-650 AED', benefit: 'Professional mounting with 1-year installation warranty' },
    { name: 'Central AC Repair', price: 'From 299 AED', benefit: 'Restore cooling efficiency within 24 hours' },
    { name: 'Duct Cleaning & Sanitization', price: 'From 399 AED', benefit: 'Eliminate allergens and improve air quality for your family' },
    { name: 'Annual Maintenance Contract', price: '799 AED/year', benefit: 'Priority service + 4 scheduled visits + parts discount' }
  ],
  portfolio: [
    { before: '🏢', after: '❄️', title: 'Villa AC Overhaul', location: 'Palm Jumeirah', description: 'Complete replacement of 6 split units' },
    { before: '🔧', after: '✨', title: 'Central AC Restoration', location: 'Business Bay', description: 'Full duct cleaning and compressor repair' },
    { before: '🌡️', after: '🏠', title: 'Smart Home Integration', location: 'Dubai Marina', description: 'Connected 4 units to smart thermostat system' }
  ],
  reviews: [
    { 
      id: 1, 
      author: 'Mohammed K.', 
      rating: 5, 
      date: '2 weeks ago',
      text: 'Excellent service! The technician arrived on time, explained everything clearly, and left the place spotless. My AC has never worked better.',
      proResponse: 'Thank you Mohammed! It was our pleasure to serve you. Looking forward to your annual maintenance visit!'
    },
    { 
      id: 2, 
      author: 'Sarah L.', 
      rating: 5, 
      date: '1 month ago',
      text: 'Called them for an emergency repair on a Friday evening. They came within 2 hours and fixed the issue. Highly recommended!',
      proResponse: 'We are glad we could help during the emergency, Sarah. Stay cool! 🌟'
    },
    { 
      id: 3, 
      author: 'Ahmed R.', 
      rating: 4, 
      date: '1 month ago',
      text: 'Good work overall. Slightly pricier than others but the quality justifies it. Will use again.',
      proResponse: 'Thank you for your feedback Ahmed. We pride ourselves on using premium materials. See you next time!'
    }
  ],
  metrics: {
    responseTime: '12 min',
    completionRate: 98,
    onTimeScore: 96,
    repeatCustomers: 72
  }
};

const VendorProfileScreen = ({ vendor, onBack, onNavigate, onStartChat }: VendorProfileScreenProps) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleGetQuote = () => {
    const newConversation: Conversation = {
      id: Date.now(),
      name: vendor.name,
      avatar: vendor.avatar,
      lastMessage: 'Hi! I would like to get a quote...',
      time: 'Now',
      unread: false,
      online: true,
      messages: []
    };
    onStartChat(newConversation);
    onNavigate('chat');
    toast.success('Starting quote conversation...');
  };

  const handleToggleFavorite = () => {
    toast.success(vendor.favorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleCall = () => {
    toast.success('Initiating call...');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* PART 1: Trust Header (Above the Fold) */}
      <div className="relative">
        {/* Cover Image/Video */}
        <div className="relative h-56 overflow-hidden">
          {vendorMarketingData.coverVideo ? (
            <div className="absolute inset-0 bg-black">
              <video 
                className="w-full h-full object-cover"
                autoPlay={isVideoPlaying}
                muted
                loop
                playsInline
              >
                <source src={vendorMarketingData.coverVideo} type="video/mp4" />
              </video>
              {!isVideoPlaying && (
                <button 
                  onClick={() => setIsVideoPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40"
                >
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </button>
              )}
            </div>
          ) : (
            <img 
              src={vendorMarketingData.coverImage} 
              alt="Work in action"
              className="w-full h-full object-cover"
              loading="eager"
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          {/* Navigation */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onBack} 
              className="p-2.5 bg-black/30 backdrop-blur-sm rounded-xl hover:bg-black/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </motion.button>
            <div className="flex gap-2">
              <button 
                onClick={handleToggleFavorite}
                className="p-2.5 bg-black/30 backdrop-blur-sm rounded-xl hover:bg-black/50 transition-colors"
              >
                <Heart className={`w-5 h-5 text-white ${vendor.favorite ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={() => {}}
                className="p-2.5 bg-black/30 backdrop-blur-sm rounded-xl hover:bg-black/50 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Core Credentials Block - Floating Card */}
        <div className="px-4 -mt-16 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-5 border border-border"
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            <div className="flex items-start gap-4">
              {/* Profile Photo */}
              <div className="w-18 h-18 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary-foreground relative">
                {vendor.avatar}
                {/* Verification Badge */}
                {vendor.verified && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-verified rounded-full flex items-center justify-center border-2 border-card">
                    <CheckCircle className="w-4 h-4 text-verified-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                {/* Company Name & Badge */}
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-display text-xl font-bold text-foreground">{vendor.name}</h1>
                </div>
                
                {/* Nectar Verified Tag */}
                {vendor.verified && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-verified/10 rounded-full mb-2">
                    <Shield className="w-3 h-3 text-verified" />
                    <span className="text-[10px] font-bold text-verified">NECTAR VERIFIED</span>
                  </div>
                )}
                
                {/* Social Proof Summary */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    <span className="font-bold text-lg text-foreground">{vendor.rating}</span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{vendor.completedJobs}+</span> Jobs Done
                  </span>
                </div>
              </div>
            </div>

            {/* Primary CTA */}
            <Button 
              onClick={handleGetQuote}
              size="lg"
              className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-base font-bold rounded-2xl"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact & Get Quote
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-32">
        
        {/* PART 2A: Portfolio / Gallery */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Our Work
            </h2>
            <button className="text-sm text-primary font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {vendorMarketingData.portfolio.map((item, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPortfolioItem(idx)}
                className="flex-shrink-0 w-48 bg-card rounded-2xl border border-border overflow-hidden"
              >
                {/* Before/After Visual */}
                <div className="h-28 bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center relative">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{item.before}</span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    <span className="text-3xl">{item.after}</span>
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                    Before/After
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* PART 2B: Company Story & USP */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-elevated p-5"
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            About Us
          </h2>
          
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {vendorMarketingData.story}
          </p>
          
          {/* USPs */}
          <div className="space-y-2">
            {vendorMarketingData.usps.map((usp, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{usp}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* PART 2C: Service Listings & Pricing */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Services & Pricing
          </h2>
          
          <div className="space-y-3">
            {vendorMarketingData.services.map((service, idx) => (
              <motion.div
                key={idx}
                whileTap={{ scale: 0.99 }}
                className="card-elevated p-4 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{service.name}</h4>
                  <span className="font-bold text-primary text-sm">{service.price}</span>
                </div>
                <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <ThumbsUp className="w-3 h-3 mt-0.5 text-green-500 flex-shrink-0" />
                  {service.benefit}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* PART 3: Performance Metrics (Transparency) */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Performance
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="card-elevated p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Timer className="w-6 h-6 text-blue-500" />
              </div>
              <div className="font-display text-2xl font-bold text-foreground">{vendorMarketingData.metrics.responseTime}</div>
              <div className="text-xs text-muted-foreground">Avg Response</div>
            </div>
            <div className="card-elevated p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-green-500" />
              </div>
              <div className="font-display text-2xl font-bold text-foreground">{vendorMarketingData.metrics.completionRate}%</div>
              <div className="text-xs text-muted-foreground">Jobs Completed</div>
            </div>
            <div className="card-elevated p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="font-display text-2xl font-bold text-foreground">{vendorMarketingData.metrics.onTimeScore}%</div>
              <div className="text-xs text-muted-foreground">On-Time Arrival</div>
            </div>
            <div className="card-elevated p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <div className="font-display text-2xl font-bold text-foreground">{vendorMarketingData.metrics.repeatCustomers}%</div>
              <div className="text-xs text-muted-foreground">Repeat Customers</div>
            </div>
          </div>
        </motion.section>

        {/* PART 3: Customer Reviews */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Quote className="w-5 h-5 text-primary" />
              Reviews
            </h2>
            <button 
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="text-sm text-primary font-medium flex items-center gap-1"
            >
              {showAllReviews ? 'Show Less' : 'View All'} <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Review Stats Bar */}
          <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-2xl border border-primary/10 mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-primary fill-primary" />
              <span className="font-display text-2xl font-bold text-foreground">{vendor.rating}</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">{vendor.reviews} Reviews</div>
              <div className="text-xs text-muted-foreground">Last 12 months</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {vendorMarketingData.reviews.slice(0, showAllReviews ? undefined : 3).map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="card-elevated overflow-hidden"
                >
                  {/* Customer Review */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground">
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{review.author}</div>
                          <div className="text-xs text-muted-foreground">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                  </div>
                  
                  {/* Pro Response */}
                  {review.proResponse && (
                    <div className="px-4 pb-4">
                      <div className="bg-secondary/50 rounded-xl p-3 border-l-4 border-primary">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-[10px] text-primary-foreground font-bold">
                              {vendor.avatar}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-foreground">Response from {vendor.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{review.proResponse}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Badges Section */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card-elevated p-4"
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Credentials
          </h2>
          <div className="flex flex-wrap gap-2">
            {vendor.verified && (
              <div className="flex items-center gap-2 bg-verified/10 px-3 py-2 rounded-xl border border-verified/20">
                <Shield className="w-4 h-4 text-verified" />
                <span className="text-sm font-medium text-verified">Nectar Verified</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-xl border border-primary/20">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Top Rated 2024</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-2 rounded-xl border border-blue-500/20">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-500">Fast Responder</span>
            </div>
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-2 rounded-xl border border-green-500/20">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">Background Checked</span>
            </div>
          </div>
        </motion.section>
      </div>

      {/* PART 4: Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-background/80 backdrop-blur-sm border-t border-border z-30">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Button 
            variant="outline" 
            size="lg"
            className="h-14 px-6 border-primary/20"
            onClick={handleCall}
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button 
            onClick={handleGetQuote}
            size="lg"
            className="flex-1 h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-bold rounded-2xl"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact & Get Quote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileScreen;
