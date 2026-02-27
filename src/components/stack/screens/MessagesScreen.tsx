import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, CheckCheck, Circle } from 'lucide-react';
import { Conversation, ScreenType, UserType } from '@/types/stack';
import BottomNav from '../BottomNav';
import { ScreenHeader } from '@/components/shared';

interface MessagesScreenProps {
  conversations: Conversation[];
  userType: UserType;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectConversation: (conversation: Conversation) => void;
}

const MessagesScreen = ({
  conversations,
  userType,
  onBack,
  onNavigate,
  onSelectConversation
}: MessagesScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || (activeFilter === 'unread' && conv.unread);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = conversations.filter(c => c.unread).length;

  return (
    <div className="w-full bg-background pb-24">
      <ScreenHeader
        title="Messages"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        onBack={onBack}
        icon={MessageCircle}
      />

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="input-modern pl-12"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 flex gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          }`}
        >
          All Chats
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
            activeFilter === 'unread'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
              activeFilter === 'unread' ? 'bg-white/20' : 'bg-primary text-primary-foreground'
            }`}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Conversations List */}
      <div className="px-4">
        {filteredConversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No messages</h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery ? 'No results found' : 'Start a conversation'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence>
              {filteredConversations.map((conversation, index) => (
                <motion.button
                  key={conversation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => onSelectConversation(conversation)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all active:scale-[0.98] ${
                    conversation.unread 
                      ? 'bg-primary/5 hover:bg-primary/10' 
                      : 'hover:bg-secondary/50'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-primary-foreground font-bold ${
                      conversation.unread ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}>
                      {conversation.avatar}
                    </div>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-background" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className={`font-semibold truncate text-sm ${
                        conversation.unread ? 'text-foreground' : 'text-foreground/80'
                      }`}>
                        {conversation.name}
                      </h3>
                      <span className={`text-xs flex-shrink-0 ml-2 ${
                        conversation.unread ? 'text-primary font-semibold' : 'text-muted-foreground'
                      }`}>
                        {conversation.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!conversation.unread && (
                        <CheckCheck className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                      <p className={`text-sm truncate ${
                        conversation.unread ? 'text-foreground font-medium' : 'text-muted-foreground'
                      }`}>
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread && (
                        <Circle className="w-2.5 h-2.5 fill-primary text-primary flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <BottomNav active="messages" userType={userType} onNavigate={onNavigate} pendingQuotes={1} unreadMessages={unreadCount} />
    </div>
  );
};

export default MessagesScreen;
