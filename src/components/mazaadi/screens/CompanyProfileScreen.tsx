import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Edit2, Star, Camera, Trash2, DollarSign, Clock, 
  CheckCircle, Sparkles, Image as ImageIcon, Upload, Play, MapPin,
  ThumbsUp, TrendingUp, Timer, Target, Users, Quote, ChevronRight,
  X, Save, Eye, MessageCircle
} from 'lucide-react';
import { ScreenType, UserType } from '@/types/mazaadi';
import BottomNav from '../BottomNav';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  description: string;
  benefit: string;
  price: string;
  duration: string;
  category: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  location: string;
  description: string;
  category: string;
  beforeEmoji: string;
  afterEmoji: string;
}

interface CompanyProfileScreenProps {
  userType: UserType;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

const CompanyProfileScreen = ({ userType, onBack, onNavigate }: CompanyProfileScreenProps) => {
  const [coverImage, setCoverImage] = useState<string>('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80');
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [companyStory, setCompanyStory] = useState(
    'We are a family-owned AC service company serving Dubai and the greater UAE since 2018. Specializing in European climate systems (Daikin, Mitsubishi, Carrier), we bring German precision and Middle Eastern hospitality to every job. Our mission? To keep you cool, comfortable, and worry-free.'
  );
  const [usps, setUsps] = useState([
    'Same-day emergency service',
    'All major European brands certified',
    'Eco-friendly cleaning solutions'
  ]);

  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'AC Deep Clean', description: 'Complete AC servicing and deep cleaning', benefit: 'Breathe cleaner air and reduce utility bills by up to 20%', price: 'From 199 AED', duration: '1-2 hours', category: 'HVAC' },
    { id: '2', name: 'Split AC Installation', description: 'Professional mounting with warranty', benefit: 'Professional mounting with 1-year installation warranty', price: '450-650 AED', duration: '2-4 hours', category: 'HVAC' },
    { id: '3', name: 'Central AC Repair', description: 'Full diagnostics and repair service', benefit: 'Restore cooling efficiency within 24 hours', price: 'From 299 AED', duration: '1-3 hours', category: 'HVAC' },
    { id: '4', name: 'Duct Cleaning & Sanitization', description: 'Complete duct system cleaning', benefit: 'Eliminate allergens and improve air quality for your family', price: 'From 399 AED', duration: '3-5 hours', category: 'HVAC' },
  ]);

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { id: '1', title: 'Villa AC Overhaul', location: 'Palm Jumeirah', description: 'Complete replacement of 6 split units', category: 'AC', beforeEmoji: '🏢', afterEmoji: '❄️' },
    { id: '2', title: 'Central AC Restoration', location: 'Business Bay', description: 'Full duct cleaning and compressor repair', category: 'AC', beforeEmoji: '🔧', afterEmoji: '✨' },
    { id: '3', title: 'Smart Home Integration', location: 'Dubai Marina', description: 'Connected 4 units to smart thermostat', category: 'AC', beforeEmoji: '🌡️', afterEmoji: '🏠' },
  ]);

  const [activePortfolioIndex, setActivePortfolioIndex] = useState(0);
  const portfolioScrollRef = useRef<HTMLDivElement>(null);

  const handlePortfolioScroll = useCallback(() => {
    if (!portfolioScrollRef.current) return;
    const container = portfolioScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = 192 + 12; // w-48 (192px) + gap-3 (12px)
    const newIndex = Math.round(scrollLeft / itemWidth);
    setActivePortfolioIndex(Math.min(newIndex, portfolio.length));
  }, [portfolio.length]);

  const metrics = {
    responseTime: '12 min',
    completionRate: 98,
    onTimeScore: 96,
    repeatCustomers: 72
  };

  const companyData = {
    name: 'Al-Mansouri Services',
    tagline: 'Professional Home Services',
    rating: 4.9,
    reviews: 156,
    verified: true,
    yearsInBusiness: 3,
    totalJobs: 500,
    successRate: 98
  };

  const handleCoverImageUpload = () => {
    toast.success('Cover image upload dialog would open here');
  };

  const handleAddService = () => {
    toast.success('Add service dialog would open here');
  };

  const handleEditService = (serviceId: string) => {
    toast.success('Edit service dialog would open here');
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
    toast.success('Service removed');
  };

  const handleAddPortfolioItem = () => {
    toast.success('Add portfolio item dialog would open here');
  };

  const handleSaveStory = () => {
    setIsEditingStory(false);
    toast.success('Company story updated!');
  };

  const handlePreviewProfile = () => {
    toast.success('Opening profile preview...');
    onNavigate('vendor-profile');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* COVER IMAGE SECTION */}
      <div className="relative">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={coverImage} 
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          
          {/* Navigation */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
            <button 
              onClick={onBack} 
              className="p-2.5 bg-black/30 backdrop-blur-sm rounded-xl hover:bg-black/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex gap-2">
              <button 
                onClick={handlePreviewProfile}
                className="p-2.5 bg-black/30 backdrop-blur-sm rounded-xl hover:bg-black/50 transition-colors"
              >
                <Eye className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Cover Upload Button */}
          <button 
            onClick={handleCoverImageUpload}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-xl text-white text-sm font-medium hover:bg-black/70 transition-colors"
          >
            <Camera className="w-4 h-4" />
            Change Cover
          </button>

          {/* Video Upload Hint */}
          <button 
            onClick={() => toast.info('Video upload coming soon!')}
            className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 bg-primary/80 backdrop-blur-sm rounded-xl text-primary-foreground text-xs font-medium hover:bg-primary transition-colors"
          >
            <Play className="w-3 h-3" />
            Add Video
          </button>
        </div>

        {/* COMPANY PROFILE CARD */}
        <div className="px-4 -mt-12 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-5 border border-border"
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            <div className="flex items-start gap-4">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-18 h-18 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  AM
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-card border border-border rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                  <Camera className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                {companyData.verified && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-verified rounded-full flex items-center justify-center border-2 border-card">
                    <CheckCircle className="w-3.5 h-3.5 text-verified-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-display text-lg font-bold text-foreground">{companyData.name}</h1>
                  <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                    <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{companyData.tagline}</p>
                
                {/* Rating & Reviews */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="font-bold text-foreground">{companyData.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">• {companyData.reviews} reviews</span>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { value: `${companyData.yearsInBusiness}+`, label: 'Years' },
                { value: `${companyData.totalJobs}+`, label: 'Jobs' },
                { value: `${companyData.successRate}%`, label: 'Success' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                  <div className="font-display text-lg font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 space-y-6">
        
        {/* PERFORMANCE METRICS */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Performance Metrics
            </h2>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-lg">Live Stats</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="card-elevated p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Timer className="w-5 h-5 text-blue-500" />
              </div>
              <div className="font-display text-xl font-bold text-foreground">{metrics.responseTime}</div>
              <div className="text-xs text-muted-foreground">Avg Response</div>
            </div>
            <div className="card-elevated p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-500" />
              </div>
              <div className="font-display text-xl font-bold text-foreground">{metrics.completionRate}%</div>
              <div className="text-xs text-muted-foreground">Jobs Completed</div>
            </div>
            <div className="card-elevated p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="font-display text-xl font-bold text-foreground">{metrics.onTimeScore}%</div>
              <div className="text-xs text-muted-foreground">On-Time Arrival</div>
            </div>
            <div className="card-elevated p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div className="font-display text-xl font-bold text-foreground">{metrics.repeatCustomers}%</div>
              <div className="text-xs text-muted-foreground">Repeat Customers</div>
            </div>
          </div>
        </motion.section>

        {/* COMPANY STORY & USP */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              About Us
            </h2>
            <button 
              onClick={() => setIsEditingStory(!isEditingStory)}
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {isEditingStory ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          <div className="card-elevated p-4">
            {isEditingStory ? (
              <div className="space-y-3">
                <textarea
                  value={companyStory}
                  onChange={(e) => setCompanyStory(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
                  placeholder="Tell your story... Who are you? What problem do you solve? Why choose you?"
                />
                <div className="text-xs text-muted-foreground">
                  Tip: Highlight your local relevance and specialization
                </div>
                <Button onClick={handleSaveStory} size="sm" className="bg-primary text-primary-foreground">
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {companyStory}
                </p>
                
                {/* USPs */}
                <div className="space-y-2">
                  {usps.map((usp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{usp}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.section>

        {/* SERVICES & PRICING */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Services & Pricing
            </h2>
            <Button 
              size="sm" 
              onClick={handleAddService}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-3">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + idx * 0.03 }}
                className="card-elevated p-4 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{service.name}</h4>
                      <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded-lg text-xs font-medium">
                        {service.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                    
                    {/* Benefit highlight */}
                    <div className="flex items-start gap-1.5 px-2 py-1.5 bg-green-500/5 rounded-lg border border-green-500/10">
                      <ThumbsUp className="w-3 h-3 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-xs text-green-700">{service.benefit}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button 
                      onClick={() => handleEditService(service.id)}
                      className="p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="p-2 bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-primary">{service.price}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{service.duration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* PORTFOLIO GALLERY */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Work Portfolio
            </h2>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleAddPortfolioItem}
              className="border-primary/20"
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mb-3 p-2 bg-secondary/50 rounded-lg">
            💡 Tip: Before/After photos of your best work help convert 40% more leads
          </div>
          
          <div 
            ref={portfolioScrollRef}
            onScroll={handlePortfolioScroll}
            className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scroll-smooth" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {portfolio.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ y: -2 }}
                className="flex-shrink-0 w-48 bg-card rounded-2xl border border-border overflow-hidden group snap-start touch-pan-x"
              >
                {/* Before/After Visual */}
                <motion.div 
                  className="h-28 bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.span 
                      className="text-3xl"
                      whileHover={{ rotate: -10, scale: 1.1 }}
                    >
                      {item.beforeEmoji}
                    </motion.span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    >
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                    <motion.span 
                      className="text-3xl"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      {item.afterEmoji}
                    </motion.span>
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                    Before/After
                  </div>
                  
                  {/* Edit overlay */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </motion.button>
                  </motion.div>
                </motion.div>
                <div className="p-3">
                  <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {/* Add New Card */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: portfolio.length * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -2, borderColor: 'hsl(var(--primary))' }}
              onClick={handleAddPortfolioItem}
              className="flex-shrink-0 w-48 h-[172px] bg-secondary/50 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors touch-pan-x"
            >
              <motion.div 
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
                whileHover={{ rotate: 90, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Plus className="w-6 h-6 text-primary" />
              </motion.div>
              <span className="text-sm font-medium text-muted-foreground">Add Work</span>
            </motion.button>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-1.5 mt-3">
            {[...portfolio, { id: 'add' }].map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  if (portfolioScrollRef.current) {
                    const itemWidth = 192 + 12;
                    portfolioScrollRef.current.scrollTo({ left: idx * itemWidth, behavior: 'smooth' });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activePortfolioIndex === idx 
                    ? 'bg-primary w-4' 
                    : 'bg-border hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </motion.section>

        {/* RECENT REVIEWS PREVIEW */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <Quote className="w-5 h-5 text-primary" />
              Recent Reviews
            </h2>
            <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Review Stats */}
          <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-2xl border border-primary/10 mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-primary fill-primary" />
              <span className="font-display text-2xl font-bold text-foreground">{companyData.rating}</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">{companyData.reviews} Reviews</div>
              <div className="text-xs text-muted-foreground">Last 12 months</div>
            </div>
          </div>
          
          {/* Sample Reviews */}
          <div className="space-y-3">
            {[
              { author: 'Mohammed K.', rating: 5, text: 'Excellent service! Arrived on time and fixed the issue quickly.', date: '2 weeks ago' },
              { author: 'Sarah L.', rating: 5, text: 'Very professional and clean work. Highly recommended!', date: '1 month ago' }
            ].map((review, idx) => (
              <div key={idx} className="card-elevated p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground text-sm">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{review.author}</div>
                      <div className="text-xs text-muted-foreground">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* PREVIEW PROFILE CTA */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="pb-4"
        >
          <Button 
            onClick={handlePreviewProfile}
            size="lg"
            variant="outline"
            className="w-full h-14 border-primary/20 text-primary font-bold rounded-2xl"
          >
            <Eye className="w-5 h-5 mr-2" />
            Preview How Customers See Your Profile
          </Button>
        </motion.section>
      </div>

      <BottomNav active="company" userType={userType} onNavigate={onNavigate} />
    </div>
  );
};

export default CompanyProfileScreen;
