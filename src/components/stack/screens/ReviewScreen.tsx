import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, Award, MessageSquare, CheckCircle, Sparkles, Briefcase, Clock, Smile, Banknote } from 'lucide-react';
import { ScreenType, Job, ReviewData } from '@/types/stack';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CategoryIcon } from '../utils/categoryIcons';
import { haptic } from '@/hooks/use-haptic';
import { ScreenHeader } from '@/components/shared';

interface ReviewScreenProps {
  job: Job;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSubmitReview: (review: ReviewData) => void;
}

const quickTags = [
  { id: 'professional', label: 'Professional', Icon: Briefcase },
  { id: 'punctual', label: 'Punctual', Icon: Clock },
  { id: 'quality', label: 'Quality Work', Icon: Star },
  { id: 'friendly', label: 'Friendly', Icon: Smile },
  { id: 'clean', label: 'Clean & Tidy', Icon: Sparkles },
  { id: 'value', label: 'Great Value', Icon: Banknote },
];

const ReviewScreen = ({ job, onBack, onNavigate, onSubmitReview }: ReviewScreenProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]);
  };

  const handleSubmit = () => {
    if (rating === 0) { toast.error('Please select a rating'); return; }
    onSubmitReview({ rating, comment, tags: selectedTags });
    setSubmitted(true);
    haptic('success');
    toast.success('Review submitted successfully!');
  };

  const getRatingText = (r: number) => {
    const texts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return texts[r] || '';
  };

  if (submitted) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Thank You!</h1>
            <p className="text-muted-foreground mb-6">Your review helps other customers.</p>
            <div className="card-elevated p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">+50 Points Earned!</span>
              </div>
              <p className="text-sm text-muted-foreground">Added to your rewards balance</p>
            </div>
            <Button onClick={() => onNavigate('consumer-home')} className="w-full bg-primary text-primary-foreground">
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title="Leave a Review" subtitle="Share your experience" onBack={onBack} />

      {/* Job Info */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
            <CategoryIcon category={job.category} className="w-5 h-5 text-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm">{job.title}</h3>
            <p className="text-xs text-muted-foreground">by {job.vendor}</p>
          </div>
          <div className="text-right">
            <div className="font-bold text-foreground">{job.amount} AED</div>
            <div className="text-xs text-success">Completed</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-32 space-y-6">
        {/* Rating */}
        <div className="text-center">
          <h2 className="font-semibold text-foreground mb-2">How was your experience?</h2>
          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star className={`w-10 h-10 transition-colors ${star <= (hoveredRating || rating) ? 'fill-primary text-primary' : 'text-border'}`} />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <span className="inline-block px-4 py-1.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold">
              {getRatingText(rating)}
            </span>
          )}
        </div>

        {/* Quick Tags */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" /> What went well?
          </h3>
          <div className="flex flex-wrap gap-2">
            {quickTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedTags.includes(tag.id) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                <tag.Icon className="w-4 h-4" /> {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Additional Comments
          </h3>
          <Textarea
            placeholder="Share more details about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-secondary border-transparent focus:border-primary/30 min-h-[100px]"
          />
        </div>

        {/* Tip */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Add a Tip (Optional)
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[0, 10, 20, 50].map((amount) => (
              <button
                key={amount}
                onClick={() => setTipAmount(amount === 0 ? null : amount)}
                className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                  (tipAmount === amount) || (amount === 0 && tipAmount === null) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                }`}
              >
                {amount === 0 ? 'None' : `${amount} AED`}
              </button>
            ))}
          </div>
        </div>

        {/* Points Preview */}
        <div className="card-elevated p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground">Earn Points</div>
                <div className="text-sm text-muted-foreground">For submitting this review</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">+50</div>
              <div className="text-xs text-muted-foreground">points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button onClick={handleSubmit} disabled={rating === 0} className="w-full bg-primary text-primary-foreground h-12 text-base font-semibold">
          Submit Review {tipAmount && `& Tip ${tipAmount} AED`}
        </Button>
      </div>
    </div>
  );
};

export default ReviewScreen;
