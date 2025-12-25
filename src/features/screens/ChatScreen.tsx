import React from 'react';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import Original from '@/components/stack/screens/ChatScreen';

const ChatScreen: React.FC = () => {
  const { selectedConversation } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();

  if (!selectedConversation) { goBack(); return null; }

  return <Original conversation={selectedConversation} onBack={goBack} onNavigate={navigateTo} />;
};

export default ChatScreen;
