import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, X, Zap, Clock, Calendar, DollarSign, Tag, FileText, MapPin, CheckCircle, Wind, Wrench, Sparkles, Paintbrush, Hammer, LucideIcon } from 'lucide-react';
import { ScreenType, RequestDetails } from '@/types/mazaadi';
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

const categories: { id: string; name: string; icon: LucideIcon }[] = [
  { id: 'ac', name: 'AC Services', icon: Wind },
  { id: 'plumbing', name: 'Plumbing', icon: Wrench },
  { id: 'electrical', name: 'Electrical', icon: Zap },
  { id: 'cleaning', name: 'Cleaning', icon: Sparkles },
  { id: 'painting', name: 'Painting', icon: Paintbrush },
  { id: 'carpentry', name: 'Carpentry', icon: Hammer },
  { id: 'other', name: 'Other', icon: FileText },
];

const urgencyOptions = [
  { id: 'flexible', label: 'Flexible', icon: Calendar, description: 'Within a week' },
  { id: 'today', label: 'Today', icon: Clock, description: 'Within 24 hours' },
  { id: 'urgent', label: 'Urgent', icon: Zap, description: 'ASAP' },
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

  const handleCategorySelect = (categoryId: string) => {
    setRequestDetails({ ...requestDetails, category: categoryId });
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
    toast.success('Job posted successfully!');
    onSubmit();
    onNavigate('consumer-home');
  };

  const canProceed = () => {
    if (step === 1) return !!requestDetails.category;
    if (step === 2) return !!requestDetails.title && !!requestDetails.description;
    if (step === 3) return !!requestDetails.budget && !!requestDetails.urgency;
    return true;
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        
        <div className="px-6 py-5 relative z-10">
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
            {[1, 2, 3].map((s) => (
              <motion.div 
                key={s} 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: s * 0.1 }}
                className="flex-1"
              >
                <div className={`h-1 rounded-full transition-all ${s <= step ? 'bg-white' : 'bg-white/20'}`} />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs opacity-60">
            <span>Category</span>
            <span>Details</span>
            <span>Budget</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 pb-32">
        {/* Step 1: Category Selection */}
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="font-display text-lg font-bold text-foreground">What service do you need?</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat, idx) => {
                const IconComponent = cat.icon;
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`p-4 rounded-2xl text-left transition-all relative overflow-hidden ${
                      requestDetails.category === cat.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border hover:border-primary/30'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                      requestDetails.category === cat.id ? 'bg-white/20' : 'bg-secondary'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">{cat.name}</span>
                    {requestDetails.category === cat.id && (
                      <CheckCircle className="absolute top-3 right-3 w-5 h-5" />
                    )}
                  </motion.button>
                );
              })}
            </div>
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
                placeholder="e.g., Fix leaking kitchen faucet"
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

        {/* Step 3: Budget & Urgency */}
        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <DollarSign className="w-4 h-4" />
                Your Budget (AED)
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

            {/* Summary Card */}
            <div className="card-elevated p-4">
              <h4 className="font-display font-bold text-foreground mb-3">Job Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-semibold text-foreground capitalize">{requestDetails.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title</span>
                  <span className="font-semibold text-foreground truncate max-w-[180px]">{requestDetails.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-semibold text-foreground">{requestDetails.budget} AED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Urgency</span>
                  <span className="font-semibold text-foreground capitalize">{requestDetails.urgency}</span>
                </div>
              </div>
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
          {step < 3 ? (
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
              Post Job
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostJobScreen;