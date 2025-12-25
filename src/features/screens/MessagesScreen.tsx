import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useConversations } from '@/hooks/use-data-queries';
import Original from '@/components/stack/screens/MessagesScreen';

const MessagesScreen: React.FC = () => {
  const { userType, setSelectedConversation } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();
  const { data: conversations = [] } = useConversations();

  return (
    <Original
      conversations={conversations}
      userType={userType}
      onBack={goBack}
      onNavigate={navigateTo}
      onSelectConversation={(conv) => {
        setSelectedConversation(conv);
        navigateTo('chat');
      }}
    />
  );
};

export default MessagesScreen;
