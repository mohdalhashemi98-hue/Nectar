import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Star, Heart, MapPin, Clock, CheckCircle, MessageCircle, 
  Phone, Briefcase, Award, Shield, Play, ChevronRight, Zap, Users,
  ThumbsUp, Image as ImageIcon, Quote, TrendingUp, Timer, Target,
  Sparkles, ExternalLink, Filter, Pin, FileCheck, Lightbulb, UserCircle,
  BadgeCheck, ShieldCheck, Info
} from 'lucide-react';
import { Vendor, ScreenType, Conversation } from '@/types/stack';
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
  coverVideo: null,
  coverImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
  tagline: 'Experts in European A/C Systems Since 2018',
  story: 'We are a family-owned AC service company serving Dubai and the greater UAE since 2018. Specializing in European climate systems (Daikin, Mitsubishi, Carrier), we bring German precision and Middle Eastern hospitality to every job. Our mission? To keep you cool, comfortable, and worry-free.',
  usps: [
    'Same-day emergency service',
    'All major European brands certified',
    'Eco-friendly cleaning solutions'
  ],
  services: [
    { name: 'AC Deep Clean', price: 'From 199 AED', benefit: 'Breathe cleaner air and reduce utility bills by up to 20%', category: 'AC Maintenance' },
    { name: 'Split AC Installation', price: '450-650 AED', benefit: 'Professional mounting with 1-year installation warranty', category: 'AC Installation' },
    { name: 'Central AC Repair', price: 'From 299 AED', benefit: 'Restore cooling efficiency within 24 hours', category: 'AC Repair' },
    { name: 'Duct Cleaning & Sanitization', price: 'From 399 AED', benefit: 'Eliminate allergens and improve air quality for your family', category: 'AC Maintenance' },
    { name: 'Annual Maintenance Contract', price: '799 AED/year', benefit: 'Priority service + 4 scheduled visits + parts discount', category: 'Maintenance' }
  ],
  portfolio: [
    { before: '🏢', after: '❄️', title: 'Villa AC Overhaul', location: 'Palm Jumeirah', description: 'Complete replacement of 6 split units' },
    { before: '🔧', after: '✨', title: 'Central AC Restoration', location: 'Business Bay', description: 'Full duct cleaning and compressor repair' },
    { before: '🌡️', after: '🏠', title: 'Smart Home Integration', location: 'Dubai Marina', description: 'Connected 4 units to smart thermostat system' }
  ],
  // Enhanced reviews with service categories and pinned status
  reviews: [
    { 
      id: 1, 
      author: 'Mohammed K.', 
      rating: 5, 
      date: '2 weeks ago',
      text: 'Excellent service! The technician arrived on time, explained everything clearly, and left the place spotless. My AC has never worked better.',
      proResponse: 'Thank you Mohammed! It was our pleasure to serve you. Looking forward to your annual maintenance visit!',
      serviceCategory: 'AC Maintenance',
      pinned: true
    },
    { 
      id: 2, 
      author: 'Sarah L.', 
      rating: 5, 
      date: '1 month ago',
      text: 'Called them for an emergency repair on a Friday evening. They came within 2 hours and fixed the issue. Highly recommended!',
      proResponse: 'We are glad we could help during the emergency, Sarah. Stay cool! 🌟',
      serviceCategory: 'AC Repair',
      pinned: true
    },
    { 
      id: 3, 
      author: 'Ahmed R.', 
      rating: 4, 
      date: '1 month ago',
      text: 'Good work overall. Slightly pricier than others but the quality justifies it. Will use again.',
      proResponse: 'Thank you for your feedback Ahmed. We pride ourselves on using premium materials. See you next time!',
      serviceCategory: 'AC Installation',
      pinned: false
    },
    { 
      id: 4, 
      author: 'Fatima H.', 
      rating: 5, 
      date: '2 months ago',
      text: 'The annual maintenance contract is worth every dirham. They are always punctual and thorough.',
      proResponse: 'Thank you Fatima! We appreciate your continued trust in our services.',
      serviceCategory: 'Maintenance',
      pinned: false
    },
    { 
      id: 5, 
      author: 'James P.', 
      rating: 5, 
      date: '3 months ago',
      text: 'Professional installation of 3 new AC units. Clean work, no mess left behind. Very impressed.',
      proResponse: 'Thank you James! Enjoy your new cooling system!',
      serviceCategory: 'AC Installation',
      pinned: false
    }
  ],
  // Certifications & Licenses
  certifications: [
    { name: 'Dubai DED Trade License', number: 'TL-2018-XXXX', verified: true, icon: 'license' },
    { name: 'HVAC Technician Certification', issuer: 'UAE Technical Institute', verified: true, icon: 'cert' },
    { name: 'Daikin Authorized Service', issuer: 'Daikin Middle East', verified: true, icon: 'brand' },
    { name: 'Carrier Certified Installer', issuer: 'Carrier UAE', verified: true, icon: 'brand' }
  ],
  // Tips & Expertise content
  expertiseTips: [
    { 
      id: 1,
      title: '3 Things to Check Before Summer',
      content: 'Clean your filters monthly, check thermostat batteries, and schedule a professional service. Your AC will thank you!',
      date: '1 week ago'
    },
    { 
      id: 2,
      title: 'Why Your AC Smells Musty',
      content: 'A musty smell usually means mold in the ducts or a clogged drain line. Don\'t ignore it - it affects air quality.',
      date: '2 weeks ago'
    },
    { 
      id: 3,
      title: 'Save 20% on Electricity Bills',
      content: 'Set your AC to 24°C, use fans to circulate air, and ensure your home is well-insulated. Small changes, big savings!',
      date: '1 month ago'
    }
  ],
  // Team members
  team: [
    { name: 'Ahmed Al-Mansouri', role: 'Founder & Lead Technician', experience: '15+ years', photo: 'AA', bio: 'Trained in Germany, specializes in European AC systems' },
    { name: 'Omar Hassan', role: 'Senior Technician', experience: '10 years', photo: 'OH', bio: 'Expert in central AC systems and duct work' },
    { name: 'Raj Kumar', role: 'Installation Specialist', experience: '8 years', photo: 'RK', bio: 'Certified by Daikin and Carrier for installations' }
  ],
  // Warranty info
  warranty: {
    title: '30-Day Service Guarantee',
    description: 'If you\'re not satisfied with our work, we\'ll come back and fix it for free within 30 days. No questions asked.',
    details: [
      'Full refund if issue not resolved',
      'Parts warranty: 6 months',
      'Labor warranty: 30 days'
    ]
  },
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
  const [reviewFilter, setReviewFilter] = useState<string>('all');
  const [showWarrantyDetails, setShowWarrantyDetails] = useState(false);

  // Get unique service categories for filtering
  const serviceCategories = ['all', ...new Set(vendorMarketingData.reviews.map(r => r.serviceCategory))];

  // Filter and sort reviews (pinned first)
  const filteredReviews = vendorMarketingData.reviews
    .filter(r => reviewFilter === 'all' || r.serviceCategory === reviewFilter)
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

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

        {/* Core Credentials Block */}
        <div className="px-4 -mt-16 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-5 border border-border"
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-18 h-18 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary-foreground relative">
                {vendor.avatar}
                {vendor.verified && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-verified rounded-full flex items-center justify-center border-2 border-card">
                    <CheckCircle className="w-4 h-4 text-verified-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-display text-xl font-bold text-foreground">{vendor.name}</h1>
                </div>
                
                {vendor.verified && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-verified/10 rounded-full mb-2">
                    <Shield className="w-3 h-3 text-verified" />
                    <span className="text-[10px] font-bold text-verified">NECTAR VERIFIED</span>
                  </div>
                )}
                
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
        
        {/* CERTIFICATION & LICENSE VERIFICATION BLOCK */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              Licenses & Certifications
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {vendorMarketingData.certifications.map((cert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 + idx * 0.05 }}
                className="card-elevated p-3 relative overflow-hidden"
              >
                <div className="absolute top-2 right-2">
                  {cert.verified && (
                    <div className="w-5 h-5 bg-verified rounded-full flex items-center justify-center">
                      <BadgeCheck className="w-3 h-3 text-verified-foreground" />
                    </div>
                  )}
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  {cert.icon === 'license' && <FileCheck className="w-5 h-5 text-primary" />}
                  {cert.icon === 'cert' && <Award className="w-5 h-5 text-primary" />}
                  {cert.icon === 'brand' && <ShieldCheck className="w-5 h-5 text-primary" />}
                </div>
                <h4 className="font-semibold text-foreground text-xs leading-tight mb-1">{cert.name}</h4>
                <p className="text-[10px] text-muted-foreground">
                  {cert.issuer || cert.number}
                </p>
                {cert.verified && (
                  <span className="text-[9px] text-verified font-bold mt-1 inline-block">✓ Verified</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* PORTFOLIO / GALLERY */}
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
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none' }}>
            {vendorMarketingData.portfolio.map((item, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPortfolioItem(idx)}
                className="flex-shrink-0 w-48 bg-card rounded-2xl border border-border overflow-hidden snap-start"
              >
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

        {/* COMPANY STORY & USP */}
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

        {/* MEET THE TEAM */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.17 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Meet the Team
            </h2>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none' }}>
            {vendorMarketingData.team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="flex-shrink-0 w-44 card-elevated p-4 text-center snap-start"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-xl font-bold text-primary-foreground">
                  {member.photo}
                </div>
                <h4 className="font-semibold text-foreground text-sm">{member.name}</h4>
                <p className="text-xs text-primary font-medium mb-1">{member.role}</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{member.experience}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* SERVICES & PRICING */}
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
                  <div>
                    <h4 className="font-semibold text-foreground">{service.name}</h4>
                    <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{service.category}</span>
                  </div>
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

        {/* TIPS & EXPERTISE FEED */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Tips & Expertise
            </h2>
          </div>
          
          <div className="space-y-3">
            {vendorMarketingData.expertiseTips.map((tip, idx) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.05 }}
                className="card-elevated p-4 border-l-4 border-primary"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-sm mb-1">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip.content}</p>
                    <span className="text-[10px] text-muted-foreground mt-2 inline-block">{tip.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* PERFORMANCE METRICS */}
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

        {/* CUSTOMER REVIEWS WITH FILTERING */}
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

          {/* SERVICE CATEGORY FILTER */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {serviceCategories.map((category) => (
              <button
                key={category}
                onClick={() => setReviewFilter(category)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  reviewFilter === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                {category === 'all' ? 'All Reviews' : category}
              </button>
            ))}
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {filteredReviews.slice(0, showAllReviews ? undefined : 3).map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`card-elevated overflow-hidden ${review.pinned ? 'ring-2 ring-primary/30' : ''}`}
                >
                  {/* PINNED BADGE - "Reviews I Love" */}
                  {review.pinned && (
                    <div className="bg-primary/10 px-4 py-2 flex items-center gap-2">
                      <Pin className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-bold text-primary uppercase">Pinned by Vendor</span>
                    </div>
                  )}
                  
                  {/* Customer Review */}
                  <div className={`p-4 ${review.pinned ? 'bg-primary/5' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground">
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">{review.author}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                            <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{review.serviceCategory}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                        ))}
                      </div>
                    </div>
                    <p className={`text-muted-foreground ${review.pinned ? 'text-base font-medium text-foreground' : 'text-sm'}`}>
                      {review.pinned && <span className="text-2xl text-primary mr-1">"</span>}
                      {review.text}
                      {review.pinned && <span className="text-2xl text-primary ml-1">"</span>}
                    </p>
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

        {/* CREDENTIALS BADGES */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card-elevated p-4"
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Trust Badges
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

      {/* STICKY BOTTOM CTA WITH WARRANTY TRANSPARENCY */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-background/80 backdrop-blur-sm border-t border-border z-30">
        {/* Warranty Toggle */}
        <AnimatePresence>
          {showWarrantyDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-green-500/10 border-b border-green-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground text-sm mb-1">{vendorMarketingData.warranty.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{vendorMarketingData.warranty.description}</p>
                    <div className="space-y-1">
                      {vendorMarketingData.warranty.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="p-4">
          {/* Warranty Link */}
          <button 
            onClick={() => setShowWarrantyDetails(!showWarrantyDetails)}
            className="w-full flex items-center justify-center gap-2 text-xs text-green-600 font-medium mb-3 hover:text-green-700 transition-colors"
          >
            <Info className="w-3 h-3" />
            {showWarrantyDetails ? 'Hide warranty details' : 'Click here to see our 30-Day Service Guarantee and Warranty details'}
          </button>
          
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
    </div>
  );
};

export default VendorProfileScreen;
