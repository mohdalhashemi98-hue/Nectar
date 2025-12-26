import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { haptic } from '@/hooks/use-haptic';

export interface Quote {
  id: string;
  job_id: string;
  vendor_id: string;
  amount: number;
  message: string;
  estimated_duration: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface QuoteWithVendor extends Quote {
  vendor?: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
    reviews?: number;
    completed_jobs?: number;
  };
}

// Fetch quotes for a specific job (for consumers)
export const useJobQuotes = (jobId: string | undefined) => {
  return useQuery({
    queryKey: ['quotes', 'job', jobId],
    queryFn: async () => {
      if (!jobId) return [];

      // Fetch quotes
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;
      if (!quotes) return [];

      // Fetch vendor info for each quote
      const vendorIds = [...new Set(quotes.map(q => q.vendor_id))];
      const { data: vendors } = await supabase
        .from('vendors')
        .select('id, name, avatar, rating, reviews, completed_jobs, user_id')
        .in('user_id', vendorIds);

      // Map vendor info to quotes
      const quotesWithVendors = quotes.map(quote => ({
        ...quote,
        status: quote.status as 'pending' | 'accepted' | 'rejected',
        vendor: vendors?.find(v => v.user_id === quote.vendor_id) || undefined,
      }));

      return quotesWithVendors as QuoteWithVendor[];
    },
    enabled: !!jobId,
  });
};

// Fetch quotes submitted by the current vendor
export const useVendorQuotes = () => {
  return useQuery({
    queryKey: ['quotes', 'vendor'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Quote[];
    },
  });
};

// Check if vendor already submitted a quote for a job
export const useHasSubmittedQuote = (jobId: string | undefined) => {
  return useQuery({
    queryKey: ['quotes', 'hasSubmitted', jobId],
    queryFn: async () => {
      if (!jobId) return false;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('quotes')
        .select('id')
        .eq('job_id', jobId)
        .eq('vendor_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!jobId,
  });
};

// Accept a quote
export const useAcceptQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quoteId, jobId }: { quoteId: string; jobId: string }) => {
      // Update the accepted quote
      const { error: acceptError } = await supabase
        .from('quotes')
        .update({ status: 'accepted' })
        .eq('id', quoteId);

      if (acceptError) throw acceptError;

      // Reject all other pending quotes for this job
      const { error: rejectError } = await supabase
        .from('quotes')
        .update({ status: 'rejected' })
        .eq('job_id', jobId)
        .neq('id', quoteId)
        .eq('status', 'pending');

      if (rejectError) throw rejectError;

      // Get quote details to update job
      const { data: quote } = await supabase
        .from('quotes')
        .select('vendor_id, amount')
        .eq('id', quoteId)
        .single();

      if (quote) {
        // Update the job with vendor info
        const { error: jobError } = await supabase
          .from('jobs')
          .update({
            vendor_id: quote.vendor_id,
            status: 'In Progress',
            amount: quote.amount,
          })
          .eq('id', jobId);

        if (jobError) throw jobError;
      }

      return { quoteId, jobId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotes', 'job', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      haptic('success');
      toast.success('Quote accepted! The vendor has been notified.');
    },
    onError: (error) => {
      toast.error('Failed to accept quote: ' + error.message);
    },
  });
};

// Reject a quote
export const useRejectQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ quoteId, jobId }: { quoteId: string; jobId: string }) => {
      const { error } = await supabase
        .from('quotes')
        .update({ status: 'rejected' })
        .eq('id', quoteId);

      if (error) throw error;
      return { quoteId, jobId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotes', 'job', variables.jobId] });
      toast.success('Quote declined');
    },
    onError: (error) => {
      toast.error('Failed to decline quote: ' + error.message);
    },
  });
};

// Withdraw a quote (vendor)
export const useWithdrawQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteId: string) => {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId);

      if (error) throw error;
      return quoteId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote withdrawn');
    },
    onError: (error) => {
      toast.error('Failed to withdraw quote: ' + error.message);
    },
  });
};