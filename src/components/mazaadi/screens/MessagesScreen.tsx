import { motion } from 'framer-motion';
import { Search, MessageSquare, Users } from 'lucide-react';
import { Conversation, ScreenType, UserType } from '@/types/mazaadi';
import BottomNav from '../BottomNav';

interface MessagesScreenProps {
  conversations: Conversation[];
  userType: UserType;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectConversation: (conversation: Conversation) => void;
}

const MessagesScreen = ({ conversations, userType, onBack, onNavigate, onSelectConversation }: MessagesScreenProps) => {
  const unreadCount = conversations.filter(c => c.unread).length;
  const onlineCount = conversations.filter(c => c.online).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-golden text-primary-foreground p-6 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/10 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold">Messages</h1>
              <p className="opacity-70 text-sm">
                {unreadCount > 0 ? `${unreadCount} unread messages` : 'All caught up!'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-3xl bg-primary-foreground/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3 mb-6"
          >
            {[
              { icon: Users, value: onlineCount, label: 'Online' },
              { icon: MessageSquare, value: unreadCount, label: 'Unread' },
              { icon: MessageSquare, value: conversations.length, label: 'Total' }
            ].map((stat, idx) => (
              <div key={idx} className="flex-1 bg-primary-foreground/20 rounded-3xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold">{stat.value}</p>
                    <p className="text-[10px] opacity-70">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Search */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-70" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-12 pr-4 py-3 rounded-3xl bg-primary-foreground/20 backdrop-blur-sm placeholder:opacity-70 border border-primary-foreground/10 focus:outline-none focus:border-primary-foreground/30 transition-colors text-primary-foreground"
            />
          </motion.div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="p-4 -mt-6 space-y-2 relative z-10">
        {conversations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No messages yet</h3>
            <p className="text-muted-foreground text-sm">Start a conversation with a vendor</p>
          </div>
        ) : (
          conversations.map((conversation, index) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.03 }}
              whileHover={{ y: -2 }}
              onClick={() => onSelectConversation(conversation)}
              className={`card-interactive p-4 ${
                conversation.unread ? 'border-foreground/20 bg-foreground/[0.02]' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-card" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold truncate ${conversation.unread ? 'text-foreground' : 'text-foreground/80'}`}>
                      {conversation.name}
                    </h3>
                    <span className={`text-xs ${
                      conversation.unread 
                        ? 'bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium' 
                        : 'text-muted-foreground'
                    }`}>
                      {conversation.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm truncate flex-1 ${conversation.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <BottomNav active="messages" userType={userType} onNavigate={onNavigate} />
    </div>
  );
};

export default MessagesScreen;