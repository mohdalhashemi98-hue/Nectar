import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useVendors, useConversations } from '@/hooks/use-data-queries';
import Original from '@/components/stack/screens/QuoteManagementScreen';
import { Offer } from '@/types/stack';

const QuoteManagementScreen: React.FC = () => {
  const { selectedJob, setSelectedVendor, setSelectedConversation, addConversation } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();
  const { data: vendors = [] } = useVendors();
  const { data: conversations = [] } = useConversations();

  if (!selectedJob) { goBack(); return null; }

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
      onAcceptOffer={(offer: Offer) => { navigateTo('consumer-home'); }}
    />
  );
};

export default QuoteManagementScreen;
