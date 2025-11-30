import { useState } from 'react';
import { motion } from 'framer-motion';
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

  if (submitted) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 mx-auto mb-6 bg-foreground rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-background" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Thank You!</h1>
            <p className="text-muted-foreground mb-6">Your review helps other customers and rewards great service providers.</p>
            
            <div className="card-elevated p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-5 h-5 text-foreground" />
                <span className="font-bold text-foreground">+50 Points Earned!</span>
              </div>
              <p className="text-sm text-muted-foreground">Added to your rewards balance</p>
            </div>

            <Button
              onClick={() => onNavigate('consumer-home')}
              className="w-full bg-foreground text-background hover:bg-foreground/90"
            >
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-background/5 rounded-full blur-3xl" />
        
        <div className="px-6 py-5 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <button onClick={onBack} className="p-2 bg-background/10 rounded-xl hover:bg-background/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold">Leave a Review</h1>
              <p className="text-background/60 text-sm">Share your experience</p>
            </div>
          </motion.div>

          {/* Job Info Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background/10 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-background/10 rounded-xl flex items-center justify-center text-xl">
                🔧
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-background/60 text-sm">by {job.vendor}</p>
              </div>
              <div className="text-right">
                <div className="font-bold">{job.amount} AED</div>
                <div className="text-xs text-success">Completed</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 pb-32 space-y-6">
        {/* Rating Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center"
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-2">How was your experience?</h2>
          <p className="text-muted-foreground text-sm mb-4">Tap to rate</p>
          
          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-foreground text-foreground'
                      : 'text-border'
                  }`}
                />
              </motion.button>
            ))}
          </div>
          
          {rating > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1.5 rounded-full bg-foreground text-background text-sm font-semibold"
            >
              {getRatingText(rating)}
            </motion.div>
          )}
        </motion.div>

        {/* Quick Tags */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" />
            What went well?
          </h3>
          <div className="flex flex-wrap gap-2">
            {quickTags.map((tag) => (
              <motion.button
                key={tag.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTagToggle(tag.id)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedTags.includes(tag.id)
                    ? 'bg-foreground text-background'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                <span>{tag.icon}</span>
                {tag.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Comment Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Additional Comments
          </h3>
          <Textarea
            placeholder="Share more details about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-secondary border-transparent focus:border-foreground/30 min-h-[100px]"
          />
        </motion.div>

        {/* Tip Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
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
                    ? 'bg-foreground text-background'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {amount === 0 ? 'None' : `${amount} AED`}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Points Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card-elevated p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-background" />
              </div>
              <div>
                <div className="font-semibold text-foreground">Earn Points</div>
                <div className="text-sm text-muted-foreground">For submitting this review</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-xl font-bold text-foreground">+50</div>
              <div className="text-xs text-muted-foreground">points</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent max-w-md mx-auto">
        <Button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full bg-foreground text-background hover:bg-foreground/90 h-12 text-base font-semibold"
        >
          Submit Review {tipAmount && `& Tip ${tipAmount} AED`}
        </Button>
      </div>
    </div>
  );
};

export default ReviewScreen;