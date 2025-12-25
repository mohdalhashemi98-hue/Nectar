import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useVendors, useConversations } from '@/hooks/use-data-queries';
import { useJobQuotes, useAcceptQuote, useRejectQuote } from '@/hooks/use-quotes';
import Original from '@/components/stack/screens/QuoteManagementScreen';
import { Offer } from '@/types/stack';

const QuoteManagementScreen: React.FC = () => {
  const { selectedJob, setSelectedVendor, setSelectedConversation, addConversation } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();
  const { data: vendors = [] } = useVendors();
  const { data: conversations = [] } = useConversations();
  
  // Fetch real quotes from database
  const jobId = selectedJob?.uuid || String(selectedJob?.id);
  const { data: quotes = [], isLoading } = useJobQuotes(jobId);
  const acceptQuote = useAcceptQuote();
  const rejectQuote = useRejectQuote();

  if (!selectedJob) { goBack(); return null; }

  // Transform quotes to Offer format for backward compatibility
  const offersFromQuotes: Offer[] = quotes.map((quote, index) => ({
    id: index + 1,
    vendor: quote.vendor?.name || 'Vendor',
    vendorId: index + 1,
    rating: quote.vendor?.rating || 5.0,
    reviews: quote.vendor?.reviews || 0,
    price: quote.amount,
    responseTime: quote.estimated_duration || '< 1 hour',
    verified: true,
    distance: '2.5 km',
    description: quote.message || 'Professional service provider',
    completionRate: quote.vendor?.completed_jobs ? Math.min(100, 80 + quote.vendor.completed_jobs) : 95,
    matchScore: 90,
    availability: 'Available now',
    message: quote.message || 'I would be happy to help with this job.',
    // Store original quote data for actions
    _quoteId: quote.id,
    _jobId: quote.job_id,
  })) as (Offer & { _quoteId: string; _jobId: string })[];

  const handleAcceptOffer = (offer: Offer & { _quoteId?: string; _jobId?: string }) => {
    if (offer._quoteId && offer._jobId) {
      acceptQuote.mutate({ quoteId: offer._quoteId, jobId: offer._jobId });
    }
    navigateTo('consumer-home');
  };

  const handleRejectOffer = (offer: Offer & { _quoteId?: string; _jobId?: string }) => {
    if (offer._quoteId && offer._jobId) {
      rejectQuote.mutate({ quoteId: offer._quoteId, jobId: offer._jobId });
    }
  };

  return (
    <Original
      job={selectedJob}
      onBack={goBack}
      onNavigate={navigateTo}
      onSelectVendorId={(id) => { const v = vendors.find(x => x.id === id); if (v) setSelectedVendor(v); }}
      onStartChatWithVendor={(id) => {
        const vendor = vendors.find(v => v.id === id);
        if (vendor) {
          const existing = conversations.find(c => c.name === vendor.name);
          if (existing) { setSelectedConversation(existing); }
          else { const n = { id: Date.now(), name: vendor.name, avatar: vendor.avatar, lastMessage: '', time: 'Now', unread: false, online: true, messages: [] }; addConversation(n); setSelectedConversation(n); }
        }
      }}
      onAcceptOffer={handleAcceptOffer}
    />
  );
};

export default QuoteManagementScreen;
