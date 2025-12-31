import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, X, Zap, Clock, Calendar, MapPin, CheckCircle, RefreshCw, CalendarDays, Repeat, Send, FileText, DollarSign, Info, TrendingUp, Sparkles, Users, BarChart3, Wand2, Loader2 } from 'lucide-react';
import { ScreenType, RequestDetails, SubscriptionFrequency } from '@/types/stack';
import { categories } from '@/data/stack-data';
import { getCategoryIcon } from '../utils/categoryIcons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { haptic } from '@/hooks/use-haptic';
import { supabase } from '@/integrations/supabase/client';

// Generate AI market benchmark data
const generateMarketData = (category: string, subService: string | null, location: string) => {
  const categoryData = categories.find(c => c.name === category);
  const subServiceData = subService ? categoryData?.subServices?.find(s => s.name === subService) : null;
  
  const basePrice = subServiceData?.avgPrice || categoryData?.avgPrice || '200 AED';
  const basePriceNum = parseInt(basePrice.replace(/[^0-9]/g, ''));
  
  const minPrice = Math.round(basePriceNum * 0.7);
  const maxPrice = Math.round(basePriceNum * 1.4);
  const avgPrice = Math.round((minPrice + maxPrice) / 2);
  
  // Generate consistent values based on inputs
  const seed = (category.length + (subService?.length || 0) + location.length);
  const confidence = 78 + (seed % 18);
  const activeVendors = 8 + (seed % 15);
  const responseTime = 12 + (seed % 20);
  
  return {
    minPrice,
    avgPrice,
    maxPrice,
    confidence,
    activeVendors,
    responseTime
  };
};

interface JobConfigurationScreenProps {
  requestDetails: RequestDetails;
  setRequestDetails: (details: RequestDetails) => void;
  selectedCategory: string | null;
  selectedSubService: string | null;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSubmit: () => void;
  onPostJob: (jobData: {
    title: string;
    description: string;
    category: string;
    budget: string;
    urgency: string;
  }) => Promise<void>;
}

const urgencyOptions = [
  { id: 'flexible', label: 'Flexible', icon: Calendar, description: 'Within a week' },
  { id: 'today', label: 'Today', icon: Clock, description: 'Within 24 hours' },
  { id: 'urgent', label: 'Urgent', icon: Zap, description: 'ASAP' },
];

const subscriptionFrequencies: { id: SubscriptionFrequency; label: string; description: string; savings: string }[] = [
  { id: 'weekly', label: 'Weekly', description: 'Every week on your preferred day', savings: '15% off' },
  { id: 'bi-weekly', label: 'Bi-Weekly', description: 'Every 2 weeks', savings: '10% off' },
  { id: 'monthly', label: 'Monthly', description: 'Once a month', savings: '5% off' },
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['Morning (8AM-12PM)', 'Afternoon (12PM-4PM)', 'Evening (4PM-8PM)'];

// Categories that support subscriptions
const subscriptionCategories = [
  'Home Cleaning',
  'Specialized Cleaning',
  'Gardening & Landscaping',
  'Laundry & Dry Cleaning',
  'Vehicle Care',
  'AC & Ventilation',
  'Pest Control'
];

const JobConfigurationScreen = ({
  requestDetails,
  setRequestDetails,
  selectedCategory,
  selectedSubService,
  onBack,
  onNavigate,
  onSubmit,
  onPostJob
}: JobConfigurationScreenProps) => {
  const [location, setLocation] = useState('Dubai Marina, Dubai');
  const [showMarketInsights, setShowMarketInsights] = useState(false);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);

  const handleGenerateSuggestion = async () => {
    setIsGeneratingSuggestion(true);
    haptic('light');
    
    try {
      const { data, error } = await supabase.functions.invoke('suggest-job-description', {
        body: {
          category: selectedCategory,
          subService: selectedSubService,
          location: location,
        },
      });

      if (error) {
        console.error('Error generating suggestion:', error);
        toast.error('Failed to generate suggestion. Please try again.');
        return;
      }

      if (data?.suggestion) {
        setRequestDetails({ ...requestDetails, description: data.suggestion });
        haptic('success');
        toast.success('AI suggestion generated!');
      } else if (data?.error) {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error calling AI:', error);
      toast.error('Failed to generate suggestion. Please try again.');
    } finally {
      setIsGeneratingSuggestion(false);
    }
  };
  
  // Get category details
  const categoryData = useMemo(() => {
    return categories.find(c => c.name === selectedCategory);
  }, [selectedCategory]);
  
  // Get sub-service details
  const subServiceData = useMemo(() => {
    if (!categoryData || !selectedSubService) return null;
    return categoryData.subServices?.find(s => s.name === selectedSubService);
  }, [categoryData, selectedSubService]);
  
  // Generate AI market data
  const marketData = useMemo(() => {
    if (!selectedCategory) return null;
    return generateMarketData(selectedCategory, selectedSubService, location);
  }, [selectedCategory, selectedSubService, location]);
  
  // Animate in the market insights after a delay
  useEffect(() => {
    const timer = setTimeout(() => setShowMarketInsights(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  const supportsSubscription = selectedCategory ? subscriptionCategories.includes(selectedCategory) : false;
  
  const IconComponent = selectedCategory ? getCategoryIcon(selectedCategory) : null;

  const handlePhotoAdd = () => {
    const newPhotos = [...requestDetails.photos, `photo-${Date.now()}`];
    setRequestDetails({ ...requestDetails, photos: newPhotos });
    toast.success('Photo added!');
  };

  const handlePhotoRemove = (index: number) => {
    const newPhotos = requestDetails.photos.filter((_, i) => i !== index);
    setRequestDetails({ ...requestDetails, photos: newPhotos });
  };

  const handleSubmit = async () => {
    if (!requestDetails.description) {
      toast.error('Please add a description of your requirements');
      return;
    }
    
    if (requestDetails.bookingType === 'subscription' && (!requestDetails.subscriptionFrequency || !requestDetails.preferredDay)) {
      toast.error('Please select subscription frequency and preferred day');
      return;
    }
    
    try {
      // Post the job to database
      await onPostJob({
        title: selectedSubService || selectedCategory || 'Service Request',
        description: requestDetails.description,
        category: selectedCategory || '',
        budget: requestDetails.budget || 'Flexible',
        urgency: requestDetails.urgency,
      });
      
      haptic('success');
      if (requestDetails.bookingType === 'subscription') {
        toast.success('Subscription booking created!', {
          description: `${requestDetails.subscriptionFrequency} ${selectedSubService || selectedCategory} scheduled`
        });
      } else {
        toast.success('Job posted successfully!', {
          description: 'Vendors can now see your request and send quotes'
        });
      }
      onSubmit();
      onNavigate('consumer-home');
    } catch (error) {
      console.error('Failed to post job:', error);
      toast.error('Failed to post job. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-golden text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
        
        <div className="px-4 py-5 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <button onClick={onBack} className="p-2 bg-primary-foreground/20 rounded-xl hover:bg-primary-foreground/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold">Configure Your Job</h1>
              <p className="text-primary-foreground/70 text-sm">Get quotes from verified pros</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-32 space-y-5">
        {/* Selected Service Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-4"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="flex items-center gap-4">
            {IconComponent && categoryData && (
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${categoryData.gradient} flex items-center justify-center text-white`}>
                <IconComponent className="w-7 h-7" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="font-semibold text-foreground text-lg">
                {selectedSubService || selectedCategory}
              </h2>
              <p className="text-sm text-muted-foreground">{selectedCategory}</p>
            </div>
            {(subServiceData?.avgPrice || categoryData?.avgPrice) && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Starting from</div>
                <div className="font-bold text-primary text-lg">
                  {subServiceData?.avgPrice || categoryData?.avgPrice}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* AI Market Price Range */}
        <AnimatePresence>
          {showMarketInsights && marketData && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-4 relative overflow-hidden">
                {/* Decorative sparkle */}
                <div className="absolute top-2 right-2">
                  <Sparkles className="w-4 h-4 text-primary/40" />
                </div>
                
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">AI Market Insights</h3>
                    <p className="text-xs text-muted-foreground">{marketData.confidence}% confidence • {location}</p>
                  </div>
                </div>
                
                {/* Price Range Visualization */}
                <div className="bg-card rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Market Price Range</span>
                    <span className="text-xs font-medium text-primary flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Fair pricing
                    </span>
                  </div>
                  
                  {/* Price bar */}
                  <div className="relative h-8 rounded-lg bg-secondary overflow-hidden mb-2">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500/20 via-primary/30 to-sky-500/20"
                      style={{ width: '100%' }}
                    />
                    {/* Markers */}
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-muted-foreground">Low</span>
                        <span className="font-bold text-xs text-foreground">{marketData.minPrice} AED</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-primary font-medium">Average</span>
                        <span className="font-bold text-sm text-primary">{marketData.avgPrice} AED</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-muted-foreground">High</span>
                        <span className="font-bold text-xs text-foreground">{marketData.maxPrice} AED</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-card rounded-xl px-3 py-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-bold text-sm text-foreground">{marketData.activeVendors}</div>
                      <div className="text-[10px] text-muted-foreground">Active vendors</div>
                    </div>
                  </div>
                  <div className="bg-card rounded-xl px-3 py-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-bold text-sm text-foreground">{marketData.responseTime} min</div>
                      <div className="text-[10px] text-muted-foreground">Avg response</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="w-4 h-4" />
              Describe Your Requirements *
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleGenerateSuggestion}
              disabled={isGeneratingSuggestion}
              className="h-8 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10"
            >
              {isGeneratingSuggestion ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  AI Suggest
                </>
              )}
            </Button>
          </div>
          <Textarea
            placeholder={`Describe what you need for your ${selectedSubService || selectedCategory} job...`}
            value={requestDetails.description}
            onChange={(e) => setRequestDetails({ ...requestDetails, description: e.target.value })}
            className="bg-secondary border-transparent focus:border-primary/30 min-h-[100px]"
          />
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
            <MapPin className="w-4 h-4" />
            Service Location
          </label>
          <Input
            placeholder="Your address or area"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-secondary border-transparent focus:border-primary/30"
          />
        </motion.div>

        {/* Urgency */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
            <Clock className="w-4 h-4" />
            When do you need this?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {urgencyOptions.map((option) => {
              const IconComp = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setRequestDetails({ ...requestDetails, urgency: option.id as 'flexible' | 'today' | 'urgent' })}
                  className={`p-3 rounded-xl text-center transition-all ${
                    requestDetails.urgency === option.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border hover:border-primary/30'
                  }`}
                >
                  <IconComp className={`w-5 h-5 mx-auto mb-1 ${requestDetails.urgency === option.id ? '' : 'text-muted-foreground'}`} />
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className={`text-[10px] ${requestDetails.urgency === option.id ? 'opacity-70' : 'text-muted-foreground'}`}>
                    {option.description}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Subscription Option */}
        {supportsSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
              <RefreshCw className="w-4 h-4" />
              Booking Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRequestDetails({ 
                  ...requestDetails, 
                  bookingType: 'one-time',
                  subscriptionFrequency: undefined,
                  preferredDay: undefined,
                  preferredTime: undefined
                })}
                className={`p-4 rounded-2xl text-left transition-all relative ${
                  requestDetails.bookingType === 'one-time'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:border-primary/20'
                }`}
              >
                <Calendar className={`w-5 h-5 mb-2 ${requestDetails.bookingType === 'one-time' ? '' : 'text-muted-foreground'}`} />
                <div className="font-semibold text-sm">One-Time</div>
                <div className={`text-xs ${requestDetails.bookingType === 'one-time' ? 'opacity-70' : 'text-muted-foreground'}`}>
                  Single booking
                </div>
                {requestDetails.bookingType === 'one-time' && (
                  <CheckCircle className="absolute top-3 right-3 w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => setRequestDetails({ 
                  ...requestDetails, 
                  bookingType: 'subscription',
                  subscriptionFrequency: 'weekly'
                })}
                className={`p-4 rounded-2xl text-left transition-all relative ${
                  requestDetails.bookingType === 'subscription'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:border-primary/20'
                }`}
              >
                <Repeat className={`w-5 h-5 mb-2 ${requestDetails.bookingType === 'subscription' ? '' : 'text-muted-foreground'}`} />
                <div className="font-semibold text-sm">Subscription</div>
                <div className={`text-xs ${requestDetails.bookingType === 'subscription' ? 'opacity-70' : 'text-muted-foreground'}`}>
                  Save up to 15%
                </div>
                {requestDetails.bookingType === 'subscription' && (
                  <CheckCircle className="absolute top-3 right-3 w-4 h-4" />
                )}
              </button>
            </div>

            {/* Subscription Details */}
            <AnimatePresence>
              {requestDetails.bookingType === 'subscription' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4 overflow-hidden"
                >
                  {/* Frequency */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Frequency</label>
                    <div className="space-y-2">
                      {subscriptionFrequencies.map((freq) => (
                        <button
                          key={freq.id}
                          onClick={() => setRequestDetails({ ...requestDetails, subscriptionFrequency: freq.id })}
                          className={`w-full p-3 rounded-xl text-left flex items-center justify-between transition-all ${
                            requestDetails.subscriptionFrequency === freq.id
                              ? 'bg-primary/10 border-2 border-primary'
                              : 'bg-secondary border-2 border-transparent'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-sm text-foreground">{freq.label}</div>
                            <div className="text-xs text-muted-foreground">{freq.description}</div>
                          </div>
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                            {freq.savings}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Day */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Preferred Day</label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day}
                          onClick={() => setRequestDetails({ ...requestDetails, preferredDay: day })}
                          className={`px-3 py-2 rounded-full text-xs font-medium transition-all ${
                            requestDetails.preferredDay === day
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Preferred Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setRequestDetails({ ...requestDetails, preferredTime: slot })}
                          className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            requestDetails.preferredTime === slot
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {slot.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Photos */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
            <Camera className="w-4 h-4" />
            Add Photos (Optional)
          </label>
          <div className="flex gap-3 flex-wrap">
            {requestDetails.photos.map((_, idx) => (
              <div key={idx} className="relative w-16 h-16 bg-secondary rounded-xl flex items-center justify-center">
                <span className="text-xl">📷</span>
                <button
                  onClick={() => handlePhotoRemove(idx)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {requestDetails.photos.length < 5 && (
              <button
                onClick={handlePhotoAdd}
                className="w-16 h-16 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1 hover:border-primary/30 transition-colors"
              >
                <Camera className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Add</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">How it works</p>
            <p className="text-xs text-muted-foreground mt-1">
              Submit your request and receive quotes from verified professionals within minutes. Compare offers and choose the best one for you.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <Button
          onClick={handleSubmit}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg rounded-2xl flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          {requestDetails.bookingType === 'subscription' ? 'Create Subscription' : 'Submit & Get Quotes'}
        </Button>
      </div>
    </div>
  );
};

export default JobConfigurationScreen;