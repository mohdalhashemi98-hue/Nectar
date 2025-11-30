import { useState } from 'react';
import { ArrowLeft, Star, ThumbsUp, Award, MessageSquare, CheckCircle, Sparkles } from 'lucide-react';
import { ScreenType, Job, ReviewData } from '@/types/mazaadi';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ReviewScreenProps {
  job: Job;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSubmitReview: (review: ReviewData) => void;
}

const quickTags = [
  { id: 'professional', label: 'Professional', icon: '👔' },
  { id: 'punctual', label: 'Punctual', icon: '⏰' },
  { id: 'quality', label: 'Quality Work', icon: '⭐' },
  { id: 'friendly', label: 'Friendly', icon: '😊' },
  { id: 'clean', label: 'Clean & Tidy', icon: '✨' },
  { id: 'value', label: 'Great Value', icon: '💰' },
];

const ReviewScreen = ({ job, onBack, onNavigate, onSubmitReview }: ReviewScreenProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    onSubmitReview({ rating, comment, tags: selectedTags });
    setSubmitted(true);
    toast.success('Review submitted successfully!');
  };

  const getRatingText = (r: number) => {
    const texts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return texts[r] || '';
  };

  const getRatingGradient = (r: number) => {
    if (r >= 4) return 'from-emerald-500 to-teal-500';
    if (r >= 3) return 'from-amber-500 to-yellow-500';
    return 'from-rose-500 to-pink-500';
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Thank You!</h1>
            <p className="text-muted-foreground mb-6">Your review helps other customers and rewards great service providers.</p>
            
            <div className="card-elevated p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-foreground">+50 Points Earned!</span>
              </div>
              <p className="text-sm text-muted-foreground">Added to your rewards balance</p>
            </div>

            <Button
              onClick={() => onNavigate('consumer-home')}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-400/20 rounded-full blur-2xl" />
        
        <div className="px-6 py-5 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
                Leave a Review
              </h1>
              <p className="text-white/70 text-sm">Share your experience</p>
            </div>
          </div>

          {/* Job Info Card */}
          <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/10 rounded-xl flex items-center justify-center text-xl">
                🔧
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">{job.title}</h3>
                <p className="text-white/70 text-sm">by {job.vendor}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">{job.amount} AED</div>
                <div className="text-xs text-emerald-300">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 pb-32 space-y-6">
        {/* Rating Section */}
        <div className="text-center animate-fade-in">
          <h2 className="text-lg font-bold text-foreground mb-2">How was your experience?</h2>
          <p className="text-muted-foreground text-sm mb-4">Tap to rate</p>
          
          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground/30'
                  }`}
                />
              </button>
            ))}
          </div>
          
          {rating > 0 && (
            <div className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${getRatingGradient(rating)} text-white text-sm font-bold animate-fade-in`}>
              {getRatingText(rating)}
            </div>
          )}
        </div>

        {/* Quick Tags */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-blue-500" />
            What went well?
          </h3>
          <div className="flex flex-wrap gap-2">
            {quickTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedTags.includes(tag.id)
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-card text-foreground hover:bg-muted'
                }`}
              >
                <span>{tag.icon}</span>
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comment Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-500" />
            Additional Comments
          </h3>
          <Textarea
            placeholder="Share more details about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-card border-border min-h-[100px]"
          />
        </div>

        {/* Tip Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Add a Tip (Optional)
          </h3>
          <p className="text-sm text-muted-foreground mb-3">Show extra appreciation for great service</p>
          <div className="grid grid-cols-4 gap-2">
            {[0, 10, 20, 50].map((amount) => (
              <button
                key={amount}
                onClick={() => setTipAmount(amount === 0 ? null : amount)}
                className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                  (tipAmount === amount) || (amount === 0 && tipAmount === null)
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                    : 'bg-card text-foreground hover:bg-muted'
                }`}
              >
                {amount === 0 ? 'None' : `${amount} AED`}
              </button>
            ))}
          </div>
        </div>

        {/* Points Preview */}
        <div className="card-elevated p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-foreground">Earn Points</div>
                <div className="text-sm text-muted-foreground">For submitting this review</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-extrabold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">+50</div>
              <div className="text-xs text-muted-foreground">points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent max-w-md mx-auto">
        <Button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 h-12 text-base font-bold"
        >
          Submit Review {tipAmount && `& Tip ${tipAmount} AED`}
        </Button>
      </div>
    </div>
  );
};

export default ReviewScreen;
