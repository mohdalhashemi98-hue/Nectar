import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Clock, FileText, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import { toast } from 'sonner';
import { haptic } from '@/hooks/use-haptic';

interface SubmitQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    budget?: string;
    description?: string;
  };
  onSuccess?: () => void;
}

const quoteSchema = z.object({
  amount: z.number()
    .min(1, 'Amount must be at least 1 AED')
    .max(1000000, 'Amount cannot exceed 1,000,000 AED'),
  message: z.string().trim().min(10, 'Please provide a brief description (min 10 characters)').max(500, 'Message too long'),
  estimatedDuration: z.string().trim().min(1, 'Please provide an estimated duration'),
});

const SubmitQuoteModal = ({ isOpen, onClose, job, onSuccess }: SubmitQuoteModalProps) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    const result = quoteSchema.safeParse({
      amount: parseFloat(amount) || 0,
      message,
      estimatedDuration,
    });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to submit a quote');
        setIsLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('quotes')
        .insert({
          job_id: job.id,
          vendor_id: user.id,
          amount: parseFloat(amount),
          message: message.trim(),
          estimated_duration: estimatedDuration.trim(),
          status: 'pending',
        });

      if (insertError) {
        if (insertError.message.includes('duplicate')) {
          setError('You have already submitted a quote for this job');
        } else {
          setError(insertError.message);
        }
        setIsLoading(false);
        return;
      }

      haptic('success');
      toast.success('Quote submitted successfully!');
      onSuccess?.();
      onClose();
      
      // Reset form
      setAmount('');
      setMessage('');
      setEstimatedDuration('');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-display text-xl font-bold text-foreground">Submit Quote</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              {/* Job Info */}
              <div className="bg-muted/50 rounded-2xl p-4 mb-4">
                <h3 className="font-semibold text-foreground mb-1">{job.title}</h3>
                {job.budget && (
                  <p className="text-sm text-muted-foreground">Budget: {job.budget}</p>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <div className="space-y-4">
                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Your Quote (AED)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value); setError(null); }}
                      className="pl-12 h-14 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Estimated Duration */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Estimated Duration
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="e.g., 2-3 hours, 1 day"
                      value={estimatedDuration}
                      onChange={(e) => { setEstimatedDuration(e.target.value); setError(null); }}
                      className="pl-12 h-14 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Message to Client
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                    <Textarea
                      placeholder="Describe your approach, experience, and what's included..."
                      value={message}
                      onChange={(e) => { setMessage(e.target.value); setError(null); }}
                      className="pl-12 min-h-[120px] rounded-2xl resize-none"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.length}/500 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full h-14 rounded-2xl text-lg font-semibold"
              >
                {isLoading ? 'Submitting...' : 'Submit Quote'}
                <Send className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SubmitQuoteModal;