import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, CheckCheck, Circle } from 'lucide-react';
import { Conversation, ScreenType, UserType } from '@/types/stack';
import BottomNav from '../BottomNav';

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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-golden px-4 pt-6 pb-5 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold text-white">Messages</h1>
              <p className="text-white/70 text-sm mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm placeholder:text-white/60 text-white border border-white/20 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 py-3 flex gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-primary text-white shadow-md shadow-primary/30'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          }`}
        >
          All Chats
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
            activeFilter === 'unread'
              ? 'bg-primary text-white shadow-md shadow-primary/30'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
              activeFilter === 'unread' ? 'bg-white/20' : 'bg-primary text-white'
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
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all active:scale-[0.98] ${
                    conversation.unread 
                      ? 'bg-primary/5 hover:bg-primary/10' 
                      : 'hover:bg-secondary/50'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      conversation.unread ? 'bg-gradient-golden' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}>
                      {conversation.avatar}
                    </div>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className={`font-semibold truncate ${
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
