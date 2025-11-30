import { useState } from 'react';
import { ArrowLeft, Camera, X, Zap, Clock, Calendar, DollarSign, Tag, FileText, MapPin, CheckCircle } from 'lucide-react';
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

const categories = [
  { id: 'ac', name: 'AC Services', icon: '❄️', gradient: 'from-cyan-500 to-blue-600' },
  { id: 'plumbing', name: 'Plumbing', icon: '🔧', gradient: 'from-blue-500 to-indigo-600' },
  { id: 'electrical', name: 'Electrical', icon: '⚡', gradient: 'from-amber-500 to-orange-600' },
  { id: 'cleaning', name: 'Cleaning', icon: '✨', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'painting', name: 'Painting', icon: '🎨', gradient: 'from-purple-500 to-pink-600' },
  { id: 'carpentry', name: 'Carpentry', icon: '🪚', gradient: 'from-orange-500 to-red-600' },
];

const urgencyOptions = [
  { id: 'flexible', label: 'Flexible', icon: Calendar, description: 'Within a week', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'today', label: 'Today', icon: Clock, description: 'Within 24 hours', gradient: 'from-amber-500 to-orange-500' },
  { id: 'urgent', label: 'Urgent', icon: Zap, description: 'ASAP', gradient: 'from-rose-500 to-pink-500' },
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
    // Simulate adding a photo
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
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl" />
        
        <div className="px-6 py-5 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                Post a Job
              </h1>
              <p className="text-white/70 text-sm">Find the right professional</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`flex-1 h-1.5 rounded-full transition-all ${s <= step ? 'bg-white' : 'bg-white/30'}`} />
                {s < 3 && <div className="w-1" />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/70">
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
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-foreground">What service do you need?</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`p-4 rounded-2xl text-left transition-all relative overflow-hidden group ${
                    requestDetails.category === cat.id
                      ? 'ring-2 ring-primary shadow-lg'
                      : 'bg-card hover:shadow-md'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className="relative z-10">
                    <span className="text-2xl mb-2 block">{cat.icon}</span>
                    <span className="font-semibold text-foreground">{cat.name}</span>
                    {requestDetails.category === cat.id && (
                      <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Job Details */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <Tag className="w-4 h-4 text-emerald-500" />
                Job Title *
              </label>
              <Input
                placeholder="e.g., Fix leaking kitchen faucet"
                value={requestDetails.title}
                onChange={(e) => setRequestDetails({ ...requestDetails, title: e.target.value })}
                className="bg-card border-border"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Description *
              </label>
              <Textarea
                placeholder="Describe what you need done in detail..."
                value={requestDetails.description}
                onChange={(e) => setRequestDetails({ ...requestDetails, description: e.target.value })}
                className="bg-card border-border min-h-[120px]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                Location
              </label>
              <Input
                placeholder="Your address or area"
                className="bg-card border-border"
                defaultValue="Dubai Marina, Dubai"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Camera className="w-4 h-4 text-purple-500" />
                Photos (Optional)
              </label>
              <div className="flex gap-3 flex-wrap">
                {requestDetails.photos.map((_, idx) => (
                  <div key={idx} className="relative w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📷</span>
                    <button
                      onClick={() => handlePhotoRemove(idx)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {requestDetails.photos.length < 5 && (
                  <button
                    onClick={handlePhotoAdd}
                    className="w-20 h-20 border-2 border-dashed border-muted-foreground/30 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    <Camera className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Budget & Urgency */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                Your Budget (AED)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {['100-200', '200-500', '500+'].map((budget) => (
                  <button
                    key={budget}
                    onClick={() => setRequestDetails({ ...requestDetails, budget })}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                      requestDetails.budget === budget
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-card text-foreground hover:bg-muted'
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
                className="bg-card border-border"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <Clock className="w-4 h-4 text-amber-500" />
                When do you need this?
              </label>
              <div className="space-y-3">
                {urgencyOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setRequestDetails({ ...requestDetails, urgency: option.id as 'flexible' | 'today' | 'urgent' })}
                    className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${
                      requestDetails.urgency === option.id
                        ? 'ring-2 ring-primary shadow-lg'
                        : 'bg-card hover:shadow-md'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${option.gradient} flex items-center justify-center shadow-lg`}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-foreground">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                    {requestDetails.urgency === option.id && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Card */}
            <div className="card-elevated p-4 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
              <h4 className="font-bold text-foreground mb-3">Job Summary</h4>
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
                  <span className="font-semibold text-emerald-500">{requestDetails.budget} AED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Urgency</span>
                  <span className="font-semibold text-foreground capitalize">{requestDetails.urgency}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent max-w-md mx-auto">
        <div className="flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25"
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
