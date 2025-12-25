import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useVendors, useConversations } from '@/hooks/use-data-queries';
import Original from '@/components/stack/screens/JobDetailScreen';

const JobDetailScreen: React.FC = () => {
  const { selectedJob, userType, setSelectedConversation, addConversation } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();
  const { data: vendors = [] } = useVendors();
  const { data: conversations = [] } = useConversations();

  if (!selectedJob) { goBack(); return null; }

  const vendor = vendors.find(v => v.id === selectedJob.vendorId) || null;

  return (
    <Original
      job={selectedJob}
      vendor={vendor}
      userType={userType}
      onBack={goBack}
      onNavigate={navigateTo}
      onStartChat={() => {
        const existingConv = conversations.find(c => c.name === selectedJob.vendor);
        if (existingConv) {
          setSelectedConversation(existingConv);
        } else if (selectedJob.vendor) {
          const newConv = { id: Date.now(), name: selectedJob.vendor, avatar: selectedJob.vendor.charAt(0), lastMessage: '', time: 'Now', unread: false, online: true, messages: [] };
          addConversation(newConv);
          setSelectedConversation(newConv);
        }
        navigateTo('chat');
      }}
    />
  );
};

export default JobDetailScreen;
