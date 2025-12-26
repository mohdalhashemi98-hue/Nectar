import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Clock, Zap, User, Calendar, DollarSign, 
  Send, MessageCircle, CheckCircle, Star, Shield, AlertCircle 
} from 'lucide-react';
import { ScreenType, AvailableJob } from '@/types/stack';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CategoryIcon } from '../utils/categoryIcons';
import { supabase } from '@/integrations/supabase/client';
import { useHasSubmittedQuote } from '@/hooks/use-quotes';
import { haptic } from '@/hooks/use-haptic';

interface RequestDetailScreenProps {
  job: AvailableJob;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

const RequestDetailScreen = ({ job, onBack, onNavigate }: RequestDetailScreenProps) => {
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  // Use the job id - AvailableJob.id maps to the available_jobs table, but we need job_id for quotes
  // Since available_jobs references jobs, we need to handle both cases
  const jobIdForQuote = (job as any).job_id || String(job.id);
  const { data: hasSubmitted, refetch: refetchHasSubmitted } = useHasSubmittedQuote(jobIdForQuote);

  const handleSubmitOffer = async () => {
    if (!offerPrice) {
      toast.error('Please enter your price');
      return;
    }
    
    if (!estimatedDuration) {
      toast.error('Please provide an estimated duration');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to submit a quote');
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('quotes')
        .insert({
          job_id: jobIdForQuote,
          vendor_id: user.id,
          amount: parseFloat(offerPrice),
          message: offerMessage.trim(),
          estimated_duration: estimatedDuration.trim(),
          status: 'pending',
        });

      if (error) {
        if (error.message.includes('duplicate')) {
          toast.error('You have already submitted a quote for this job');
        } else {
          toast.error(error.message);
        }
        setIsSubmitting(false);
        return;
      }

      setOfferSent(true);
      refetchHasSubmitted();
      haptic('success');
      toast.success('Offer sent successfully!');
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (offerSent) {
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
              className="w-24 h-24 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-primary-foreground" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Offer Sent!</h1>
            <p className="text-muted-foreground mb-6">
              Your offer of {offerPrice} AED has been sent to {job.client.name}. 
              You'll be notified when they respond.
            </p>
            
            <div className="card-elevated p-4 mb-6 text-left">
              <h3 className="font-semibold text-foreground mb-2">{job.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{job.client.name}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => onNavigate('messages-list')}
                variant="outline"
                className="w-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Go to Messages
              </Button>
              <Button
                onClick={() => onNavigate('vendor-home')}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold">Job Request</h1>
              <p className="text-primary-foreground/60 text-sm">Review and submit offer</p>
            </div>
            {job.urgent && (
              <span className="px-3 py-1.5 bg-white/20 rounded-xl text-sm font-semibold flex items-center gap-1">
                <Zap className="w-4 h-4" />
                URGENT
              </span>
            )}
          </motion.div>

          {/* Job Title Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/15 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CategoryIcon category={job.category} className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {job.time}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{job.budget}</div>
                <div className="text-xs text-primary-foreground/60">Budget</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-32 space-y-5">
        {/* Client Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-elevated p-4"
        >
          <h3 className="font-display font-bold text-foreground mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Client Information
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center font-bold text-foreground text-lg">
              {job.client.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground">{job.client.name}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                Member since {job.client.member}
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-success/10 rounded-lg">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-xs text-success font-medium">Verified</span>
            </div>
          </div>
        </motion.div>

        {/* Job Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-4"
        >
          <h3 className="font-display font-bold text-foreground mb-3">Job Description</h3>
          <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Category</div>
                <div className="flex items-center gap-2">
                  <CategoryIcon category={job.category} className="w-4 h-4 text-foreground" />
                  <span className="font-medium text-foreground">{job.category}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Budget Range</div>
                <div className="font-medium text-foreground">{job.budget}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tips for Winning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-4"
        >
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            Tips to Win This Job
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Respond quickly - fast responses get more jobs</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Include a personalized message showing you understand the job</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Competitive pricing within the budget range</span>
            </li>
          </ul>
        </motion.div>

        {/* Submit Offer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevated p-4"
        >
          <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
            <Send className="w-4 h-4" />
            Submit Your Offer
          </h3>
          
          {hasSubmitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Quote Already Submitted</h4>
              <p className="text-sm text-muted-foreground">
                You've already submitted a quote for this job. The client will review and respond.
              </p>
            </div>
          ) : (
            <>
              {/* Price Input */}
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">Your Price (AED)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="Enter your price"
                    className="w-full pl-10 pr-4 py-3 bg-secondary border-transparent rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Client budget: {job.budget}
                </p>
              </div>

              {/* Estimated Duration */}
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">Estimated Duration</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    placeholder="e.g., 2-3 hours, 1 day"
                    className="w-full pl-10 pr-4 py-3 bg-secondary border-transparent rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Message Input */}
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">Message to Client</label>
                <Textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="Introduce yourself and explain why you're the best fit for this job..."
                  className="bg-secondary border-transparent focus:border-foreground/30 min-h-[100px]"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {offerMessage.length}/500 characters
                </p>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-xl mb-4">
                <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  By submitting an offer, you agree to complete the job at the quoted price if accepted by the client.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Bottom Action */}
      {!hasSubmitted && (
        <div className="sticky bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
          <Button
            onClick={handleSubmitOffer}
            disabled={!offerPrice || !estimatedDuration || isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                />
                Sending Offer...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Submit Offer {offerPrice && `(${offerPrice} AED)`}
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RequestDetailScreen;
