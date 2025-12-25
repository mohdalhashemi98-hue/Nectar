import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface QuotePayload {
  id: string;
  job_id: string;
  vendor_id: string;
  amount: number;
  message: string;
  status: string;
  created_at: string;
}

export const useRealtimeQuotes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleNewQuote = useCallback(async (payload: { new: QuotePayload }) => {
    const quote = payload.new;
    
    // Fetch job title for the notification
    const { data: job } = await supabase
      .from('jobs')
      .select('title, user_id')
      .eq('id', quote.job_id)
      .maybeSingle();

    // Only notify if the current user is the job owner
    if (job && job.user_id === user?.id) {
      // Fetch vendor name
      const { data: vendor } = await supabase
        .from('vendors')
        .select('name')
        .eq('user_id', quote.vendor_id)
        .maybeSingle();

      const vendorName = vendor?.name || 'A vendor';
      
      toast.success(`New Quote Received!`, {
        description: `${vendorName} quoted ${quote.amount} AED for "${job.title}"`,
        action: {
          label: 'View',
          onClick: () => {
            // Navigate to quote management - handled by the component using this hook
            window.dispatchEvent(new CustomEvent('navigate-to-quotes', { 
              detail: { jobId: quote.job_id } 
            }));
          },
        },
        duration: 8000,
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['quotes', 'job', quote.job_id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  }, [user?.id, queryClient]);

  const handleQuoteStatusChange = useCallback(async (payload: { new: QuotePayload; old: QuotePayload }) => {
    const quote = payload.new;
    const oldQuote = payload.old;

    // Only notify on status changes
    if (quote.status === oldQuote.status) return;

    // If vendor's quote was accepted/rejected, notify them
    if (quote.vendor_id === user?.id) {
      const { data: job } = await supabase
        .from('jobs')
        .select('title')
        .eq('id', quote.job_id)
        .maybeSingle();

      if (quote.status === 'accepted') {
        toast.success('Quote Accepted!', {
          description: `Your quote for "${job?.title || 'a job'}" has been accepted!`,
          duration: 8000,
        });
      } else if (quote.status === 'rejected') {
        toast.info('Quote Declined', {
          description: `Your quote for "${job?.title || 'a job'}" was not selected.`,
          duration: 5000,
        });
      }

      // Invalidate vendor quotes
      queryClient.invalidateQueries({ queryKey: ['quotes', 'vendor'] });
    }
  }, [user?.id, queryClient]);

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to new quotes (INSERT events)
    const insertChannel = supabase
      .channel('quotes-insert')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quotes',
        },
        (payload) => {
          const newQuote = payload.new as QuotePayload;
          handleNewQuote({ new: newQuote });
        }
      )
      .subscribe();

    // Subscribe to quote status updates (UPDATE events)
    const updateChannel = supabase
      .channel('quotes-update')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quotes',
        },
        (payload) => {
          const newQuote = payload.new as QuotePayload;
          const oldQuote = payload.old as QuotePayload;
          handleQuoteStatusChange({ new: newQuote, old: oldQuote });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(insertChannel);
      supabase.removeChannel(updateChannel);
    };
  }, [user?.id, handleNewQuote, handleQuoteStatusChange]);
};

export default useRealtimeQuotes;
