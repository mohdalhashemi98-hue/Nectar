import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, Zap, User, Calendar, DollarSign, 
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
import { ScreenHeader } from '@/components/shared';

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
  const jobIdForQuote = (job as any).job_id || String(job.id);
  const { data: hasSubmitted, refetch: refetchHasSubmitted } = useHasSubmittedQuote(jobIdForQuote);

  const handleSubmitOffer = async () => {
    if (!offerPrice) { toast.error('Please enter your price'); return; }
    if (!estimatedDuration) { toast.error('Please provide an estimated duration'); return; }
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('You must be logged in to submit a quote'); setIsSubmitting(false); return; }

      const { error } = await supabase.from('quotes').insert({
        job_id: jobIdForQuote, vendor_id: user.id, amount: parseFloat(offerPrice),
        message: offerMessage.trim(), estimated_duration: estimatedDuration.trim(), status: 'pending',
      });

      if (error) {
        toast.error(error.message.includes('duplicate') ? 'You have already submitted a quote for this job' : error.message);
        setIsSubmitting(false); return;
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
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Offer Sent!</h1>
            <p className="text-muted-foreground mb-6">
              Your offer of {offerPrice} AED has been sent to {job.client.name}.
            </p>
            <div className="space-y-3">
              <Button onClick={() => onNavigate('messages-list')} variant="outline" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" /> Go to Messages
              </Button>
              <Button onClick={() => onNavigate('vendor-home')} className="w-full bg-primary text-primary-foreground">
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader
        title="Job Request"
        subtitle="Review and submit offer"
        onBack={onBack}
        rightAction={
          job.urgent ? (
            <span className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-xl text-sm font-semibold flex items-center gap-1">
              <Zap className="w-4 h-4" /> URGENT
            </span>
          ) : undefined
        }
      />

      {/* Job Summary */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
            <CategoryIcon category={job.category} className="w-5 h-5 text-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{job.title}</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.distance}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.time}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-foreground">{job.budget}</div>
            <div className="text-xs text-muted-foreground">Budget</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-32 space-y-5">
        {/* Client Info */}
        <div className="card-elevated p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Client Information</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-foreground">
              {job.client.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground text-sm">{job.client.name}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" /> Member since {job.client.member}
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-success/10 rounded-lg">
              <Shield className="w-3.5 h-3.5 text-success" />
              <span className="text-xs text-success font-medium">Verified</span>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="card-elevated p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Job Description</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{job.description}</p>
        </div>

        {/* Tips */}
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-primary" /> Tips to Win This Job
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />Respond quickly</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />Include a personalized message</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />Competitive pricing within the budget</li>
          </ul>
        </div>

        {/* Submit Offer */}
        <div className="card-elevated p-4">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Send className="w-4 h-4" /> Submit Your Offer
          </h3>
          
          {hasSubmitted ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Quote Already Submitted</h4>
              <p className="text-sm text-muted-foreground">The client will review and respond.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">Your Price (AED)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="Enter your price" className="input-modern pl-10" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Client budget: {job.budget}</p>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">Estimated Duration</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="text" value={estimatedDuration} onChange={(e) => setEstimatedDuration(e.target.value)} placeholder="e.g., 2-3 hours" className="input-modern pl-10" />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">Message to Client</label>
                <Textarea value={offerMessage} onChange={(e) => setOfferMessage(e.target.value)} placeholder="Why you're the best fit..." className="bg-secondary border-transparent focus:border-primary/30 min-h-[100px]" maxLength={500} />
                <p className="text-xs text-muted-foreground mt-1 text-right">{offerMessage.length}/500</p>
              </div>
            </>
          )}
        </div>
      </div>

      {!hasSubmitted && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <Button onClick={handleSubmitOffer} disabled={!offerPrice || !estimatedDuration || isSubmitting} className="w-full bg-primary text-primary-foreground h-12 text-base font-semibold">
            {isSubmitting ? 'Sending Offer...' : `Submit Offer ${offerPrice ? `(${offerPrice} AED)` : ''}`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RequestDetailScreen;
