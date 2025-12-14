import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, X, Zap, Clock, Calendar, DollarSign, Tag, FileText, MapPin, CheckCircle, RefreshCw, CalendarDays, Repeat } from 'lucide-react';
import { ScreenType, RequestDetails, BookingType, SubscriptionFrequency } from '@/types/mazaadi';
import { categories } from '@/data/mazaadi-data';
import { getCategoryIcon } from '../utils/categoryIcons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface PostJobScreenProps {
  requestDetails: RequestDetails;
  setRequestDetails: (details: RequestDetails) => void;
  selectedCategory: string | null;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSubmit: () => void;
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

const PostJobScreen = ({
  requestDetails,
  setRequestDetails,
  selectedCategory,
  onBack,
  onNavigate,
  onSubmit
}: PostJobScreenProps) => {
  const [step, setStep] = useState(1);

  // Check if selected category supports subscriptions
  const supportsSubscription = useMemo(() => {
    const selectedCat = categories.find(c => 
      c.name === requestDetails.category || 
      c.name.toLowerCase().includes(requestDetails.category.toLowerCase())
    );
    return selectedCat ? subscriptionCategories.includes(selectedCat.name) : false;
  }, [requestDetails.category]);

  // Determine total steps (4 if subscription eligible, 3 otherwise)
  const totalSteps = supportsSubscription ? 4 : 3;

  const handleCategorySelect = (categoryName: string) => {
    setRequestDetails({ ...requestDetails, category: categoryName });
  };

  const handlePhotoAdd = () => {
    const newPhotos = [...requestDetails.photos, `photo-${Date.now()}`];
    setRequestDetails({ ...requestDetails, photos: newPhotos });
    toast.success('Photo added!');
  };

  const handlePhotoRemove = (index: number) => {
    const newPhotos = requestDetails.photos.filter((_, i) => i !== index);
    setRequestDetails({ ...requestDetails, photos: newPhotos });
  };

  const handleSubmit = () => {
    if (!requestDetails.title || !requestDetails.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (requestDetails.bookingType === 'subscription') {
      toast.success('Subscription booking created!', {
        description: `${requestDetails.subscriptionFrequency} service scheduled`
      });
    } else {
      toast.success('Job posted successfully!');
    }
    onSubmit();
    onNavigate('consumer-home');
  };

  const canProceed = () => {
    if (step === 1) return !!requestDetails.category;
    if (step === 2) return !!requestDetails.title && !!requestDetails.description;
    if (step === 3 && supportsSubscription) {
      // Booking type step
      if (requestDetails.bookingType === 'subscription') {
        return !!requestDetails.subscriptionFrequency && !!requestDetails.preferredDay;
      }
      return true;
    }
    if ((step === 3 && !supportsSubscription) || step === 4) {
      return !!requestDetails.budget && !!requestDetails.urgency;
    }
    return true;
  };

  const getStepLabels = () => {
    if (supportsSubscription) {
      return ['Category', 'Details', 'Schedule', 'Budget'];
    }
    return ['Category', 'Details', 'Budget'];
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        
        <div className="px-4 py-5 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <button onClick={onBack} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold">Post a Job</h1>
              <p className="text-primary-foreground/60 text-sm">Find the right professional</p>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <motion.div 
                key={i} 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex-1"
              >
                <div className={`h-1 rounded-full transition-all ${i + 1 <= step ? 'bg-white' : 'bg-white/20'}`} />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs opacity-60">
            {getStepLabels().map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-32">
        {/* Step 1: Category Selection */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="font-display text-lg font-bold text-foreground">What service do you need?</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.slice(0, 8).map((cat, idx) => {
                const IconComponent = getCategoryIcon(cat.name);
                const isSelected = requestDetails.category === cat.name;
                const hasSubscription = subscriptionCategories.includes(cat.name);
                
                return (
                  <motion.button
                    key={cat.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`p-4 rounded-2xl text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border hover:border-primary/30'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                      isSelected ? 'bg-white/20' : `bg-gradient-to-br ${cat.gradient} text-white`
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm">{cat.name}</span>
                    {hasSubscription && (
                      <span className={`absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20' : 'bg-primary/10 text-primary'
                      }`}>
                        <Repeat className="w-3 h-3 inline mr-0.5" />
                        Sub
                      </span>
                    )}
                    {isSelected && (
                      <CheckCircle className="absolute bottom-3 right-3 w-5 h-5" />
                    )}
                  </motion.button>
                );
              })}
            </div>
            <button 
              onClick={() => onNavigate('services')}
              className="w-full py-3 text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View All Services →
            </button>
          </motion.div>
        )}

        {/* Step 2: Job Details */}
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Tag className="w-4 h-4" />
                Job Title *
              </label>
              <Input
                placeholder="e.g., Weekly home cleaning service"
                value={requestDetails.title}
                onChange={(e) => setRequestDetails({ ...requestDetails, title: e.target.value })}
                className="bg-secondary border-transparent focus:border-foreground/30"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <FileText className="w-4 h-4" />
                Description *
              </label>
              <Textarea
                placeholder="Describe what you need done in detail..."
                value={requestDetails.description}
                onChange={(e) => setRequestDetails({ ...requestDetails, description: e.target.value })}
                className="bg-secondary border-transparent focus:border-foreground/30 min-h-[120px]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <Input
                placeholder="Your address or area"
                className="bg-secondary border-transparent focus:border-foreground/30"
                defaultValue="Dubai Marina, Dubai"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Camera className="w-4 h-4" />
                Photos (Optional)
              </label>
              <div className="flex gap-3 flex-wrap">
                {requestDetails.photos.map((_, idx) => (
                  <div key={idx} className="relative w-20 h-20 bg-secondary rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📷</span>
                    <button
                      onClick={() => handlePhotoRemove(idx)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {requestDetails.photos.length < 5 && (
                  <button
                    onClick={handlePhotoAdd}
                    className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1 hover:border-foreground/30 transition-colors"
                  >
                    <Camera className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Booking Type & Schedule (for subscription-eligible categories) */}
        {step === 3 && supportsSubscription && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Booking Type Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <RefreshCw className="w-4 h-4" />
                Booking Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
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
                  <Calendar className={`w-6 h-6 mb-2 ${requestDetails.bookingType === 'one-time' ? '' : 'text-muted-foreground'}`} />
                  <div className="font-semibold">One-Time</div>
                  <div className={`text-xs ${requestDetails.bookingType === 'one-time' ? 'opacity-70' : 'text-muted-foreground'}`}>
                    Single booking
                  </div>
                  {requestDetails.bookingType === 'one-time' && (
                    <CheckCircle className="absolute top-3 right-3 w-5 h-5" />
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
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
                  <Repeat className={`w-6 h-6 mb-2 ${requestDetails.bookingType === 'subscription' ? '' : 'text-muted-foreground'}`} />
                  <div className="font-semibold">Subscription</div>
                  <div className={`text-xs ${requestDetails.bookingType === 'subscription' ? 'opacity-70' : 'text-muted-foreground'}`}>
                    Recurring service
                  </div>
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    requestDetails.bookingType === 'subscription' ? 'bg-white/20' : 'bg-primary/10 text-primary'
                  }`}>
                    Save up to 15%
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Subscription Options */}
            <AnimatePresence>
              {requestDetails.bookingType === 'subscription' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5 overflow-hidden"
                >
                  {/* Frequency Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                      <CalendarDays className="w-4 h-4" />
                      Frequency
                    </label>
                    <div className="space-y-2">
                      {subscriptionFrequencies.map((freq) => (
                        <motion.button
                          key={freq.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setRequestDetails({ ...requestDetails, subscriptionFrequency: freq.id })}
                          className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between ${
                            requestDetails.subscriptionFrequency === freq.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-card border border-border hover:border-primary/20'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{freq.label}</div>
                            <div className={`text-xs ${requestDetails.subscriptionFrequency === freq.id ? 'opacity-70' : 'text-muted-foreground'}`}>
                              {freq.description}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                              requestDetails.subscriptionFrequency === freq.id 
                                ? 'bg-white/20' 
                                : 'bg-green-500/10 text-green-600'
                            }`}>
                              {freq.savings}
                            </span>
                            {requestDetails.subscriptionFrequency === freq.id && (
                              <CheckCircle className="w-5 h-5" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Day */}
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-3 block">
                      Preferred Day
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day}
                          onClick={() => setRequestDetails({ ...requestDetails, preferredDay: day })}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
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
                    <label className="text-sm font-semibold text-foreground mb-3 block">
                      Preferred Time
                    </label>
                    <div className="space-y-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setRequestDetails({ ...requestDetails, preferredTime: slot })}
                          className={`w-full p-3 rounded-xl text-sm font-medium text-left transition-all flex items-center justify-between ${
                            requestDetails.preferredTime === slot
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-foreground hover:bg-secondary/80'
                          }`}
                        >
                          {slot}
                          {requestDetails.preferredTime === slot && <CheckCircle className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subscription Summary */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Repeat className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-foreground">Subscription Benefits</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>✓ Priority booking with verified professionals</li>
                      <li>✓ Same professional for consistency</li>
                      <li>✓ Easy reschedule & pause anytime</li>
                      <li>✓ Cancel subscription anytime</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Step 3/4: Budget & Urgency */}
        {((step === 3 && !supportsSubscription) || step === 4) && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <DollarSign className="w-4 h-4" />
                {requestDetails.bookingType === 'subscription' ? 'Budget per Visit (AED)' : 'Your Budget (AED)'}
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {['100-200', '200-500', '500+'].map((budget) => (
                  <button
                    key={budget}
                    onClick={() => setRequestDetails({ ...requestDetails, budget })}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                      requestDetails.budget === budget
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {budget} AED
                  </button>
                ))}
              </div>
              <Input
                placeholder="Or enter custom amount"
                value={!['100-200', '200-500', '500+'].includes(requestDetails.budget) ? requestDetails.budget : ''}
                onChange={(e) => setRequestDetails({ ...requestDetails, budget: e.target.value })}
                className="bg-secondary border-transparent focus:border-foreground/30"
              />
            </div>

            {requestDetails.bookingType === 'one-time' && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Clock className="w-4 h-4" />
                  When do you need this?
                </label>
                <div className="space-y-3">
                  {urgencyOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setRequestDetails({ ...requestDetails, urgency: option.id as 'flexible' | 'today' | 'urgent' })}
                      className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${
                        requestDetails.urgency === option.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border hover:border-primary/20'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        requestDetails.urgency === option.id ? 'bg-white/20' : 'bg-secondary'
                      }`}>
                        <option.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{option.label}</div>
                        <div className={`text-sm ${requestDetails.urgency === option.id ? 'opacity-70' : 'text-muted-foreground'}`}>
                          {option.description}
                        </div>
                      </div>
                      {requestDetails.urgency === option.id && (
                        <CheckCircle className="w-5 h-5" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Card */}
            <div className="card-elevated p-4">
              <h4 className="font-display font-bold text-foreground mb-3">
                {requestDetails.bookingType === 'subscription' ? 'Subscription Summary' : 'Job Summary'}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-semibold text-foreground">{requestDetails.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title</span>
                  <span className="font-semibold text-foreground truncate max-w-[180px]">{requestDetails.title}</span>
                </div>
                {requestDetails.bookingType === 'subscription' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency</span>
                      <span className="font-semibold text-primary capitalize">{requestDetails.subscriptionFrequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Preferred Day</span>
                      <span className="font-semibold text-foreground">{requestDetails.preferredDay}</span>
                    </div>
                    {requestDetails.preferredTime && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Preferred Time</span>
                        <span className="font-semibold text-foreground">{requestDetails.preferredTime}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {requestDetails.bookingType === 'subscription' ? 'Budget/Visit' : 'Budget'}
                  </span>
                  <span className="font-semibold text-foreground">{requestDetails.budget} AED</span>
                </div>
                {requestDetails.bookingType === 'one-time' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Urgency</span>
                    <span className="font-semibold text-foreground capitalize">{requestDetails.urgency}</span>
                  </div>
                )}
              </div>
              
              {requestDetails.bookingType === 'subscription' && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estimated Savings</span>
                    <span className="font-bold text-green-600">
                      {requestDetails.subscriptionFrequency === 'weekly' ? '15%' : 
                       requestDetails.subscriptionFrequency === 'bi-weekly' ? '10%' : '5%'} off
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent max-w-md mx-auto">
        <div className="flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1 border-foreground/20 hover:bg-secondary"
            >
              Back
            </Button>
          )}
          {step < totalSteps ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {requestDetails.bookingType === 'subscription' ? 'Create Subscription' : 'Post Job'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostJobScreen;
