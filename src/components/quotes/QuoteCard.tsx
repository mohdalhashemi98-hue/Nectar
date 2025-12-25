import { motion } from 'framer-motion';
import { Clock, Check, X, User, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export interface Quote {
  id: string;
  job_id: string;
  vendor_id: string;
  amount: number;
  message: string;
  estimated_duration: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  vendor?: {
    name: string;
    avatar?: string;
    rating?: number;
    reviews?: number;
    completed_jobs?: number;
  };
}

interface QuoteCardProps {
  quote: Quote;
  onAccept?: (quoteId: string) => void;
  onReject?: (quoteId: string) => void;
  onMessage?: (vendorId: string) => void;
  isLoading?: boolean;
  showActions?: boolean;
}

const QuoteCard = ({ 
  quote, 
  onAccept, 
  onReject, 
  onMessage,
  isLoading = false,
  showActions = true 
}: QuoteCardProps) => {
  const statusColors = {
    pending: 'bg-warning/10 text-warning',
    accepted: 'bg-green-500/10 text-green-600',
    rejected: 'bg-destructive/10 text-destructive',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-4"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      {/* Vendor Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
            {quote.vendor?.avatar || quote.vendor?.name?.charAt(0) || <User className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{quote.vendor?.name || 'Vendor'}</h4>
            {quote.vendor?.rating && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                <span>{quote.vendor.rating}</span>
                {quote.vendor.reviews && (
                  <span>({quote.vendor.reviews} reviews)</span>
                )}
              </div>
            )}
          </div>
        </div>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[quote.status]}`}>
          {quote.status}
        </span>
      </div>

      {/* Quote Details */}
      <div className="bg-muted/50 rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Quote Amount</span>
          <span className="text-xl font-bold text-primary">{quote.amount} AED</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Est. {quote.estimated_duration}</span>
        </div>
      </div>

      {/* Message */}
      {quote.message && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {quote.message}
        </p>
      )}

      {/* Time */}
      <p className="text-xs text-muted-foreground mb-3">
        Submitted {formatDistanceToNow(new Date(quote.created_at), { addSuffix: true })}
      </p>

      {/* Actions */}
      {showActions && quote.status === 'pending' && (
        <div className="flex gap-2">
          {onMessage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMessage(quote.vendor_id)}
              className="flex-1 rounded-xl"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Message
            </Button>
          )}
          {onReject && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(quote.id)}
              disabled={isLoading}
              className="rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          {onAccept && (
            <Button
              size="sm"
              onClick={() => onAccept(quote.id)}
              disabled={isLoading}
              className="flex-1 rounded-xl"
            >
              <Check className="w-4 h-4 mr-1" />
              Accept
            </Button>
          )}
        </div>
      )}

      {/* Accepted/Rejected state */}
      {quote.status === 'accepted' && (
        <div className="flex items-center gap-2 text-green-600 bg-green-500/10 rounded-xl p-3">
          <Check className="w-5 h-5" />
          <span className="font-medium">Quote Accepted</span>
        </div>
      )}

      {quote.status === 'rejected' && (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-xl p-3">
          <X className="w-5 h-5" />
          <span className="font-medium">Quote Declined</span>
        </div>
      )}
    </motion.div>
  );
};

export default QuoteCard;