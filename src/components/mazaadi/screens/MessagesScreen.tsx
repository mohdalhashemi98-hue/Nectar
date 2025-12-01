import { motion } from 'framer-motion';
import { Search, MessageSquare, Users, Sparkles, Circle, CheckCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background pb-24">
      {/* Header */}
      <div className="bg-gradient-golden text-primary-foreground p-6 pb-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-foreground/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-primary-foreground/5 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-2xl font-bold">Messages</h1>
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-5 h-5 text-primary-foreground/80" />
                </motion.div>
              </div>
              <p className="opacity-80 text-sm">
                {unreadCount > 0 ? `${unreadCount} unread conversations` : 'All caught up!'}
              </p>
            </div>
            <motion.div 
              className="w-14 h-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare className="w-7 h-7" />
            </motion.div>
          </motion.div>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            {[
              { icon: Circle, value: onlineCount, label: 'Online Now', color: 'bg-emerald-400' },
              { icon: MessageSquare, value: unreadCount, label: 'Unread', color: 'bg-primary-foreground' },
              { icon: Users, value: conversations.length, label: 'Total Chats', color: 'bg-amber-300' }
            ].map((stat, idx) => (
              <motion.div 
                key={idx} 
                className="bg-primary-foreground/15 backdrop-blur-sm rounded-2xl p-3 border border-primary-foreground/10"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.2)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center text-center gap-1">
                  <div className={`w-8 h-8 rounded-xl ${idx === 0 ? 'bg-emerald-400/30' : 'bg-primary-foreground/20'} flex items-center justify-center`}>
                    {idx === 0 ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 rounded-full bg-emerald-400"
                      />
                    ) : (
                      <stat.icon className="w-4 h-4" />
                    )}
                  </div>
                  <p className="font-display text-2xl font-bold">{stat.value}</p>
                  <p className="text-[10px] opacity-70 leading-tight">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Search */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-primary-foreground/20 backdrop-blur-md placeholder:opacity-60 border border-primary-foreground/20 focus:outline-none focus:border-primary-foreground/40 focus:bg-primary-foreground/25 transition-all text-primary-foreground shadow-inner"
            />
          </motion.div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="px-4 -mt-10 space-y-3 relative z-10">
        {conversations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-lg"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-amber-200/30 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No messages yet</h3>
            <p className="text-muted-foreground text-sm">Start a conversation with a vendor</p>
          </motion.div>
        ) : (
          conversations.map((conversation, index) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05, type: 'spring', stiffness: 300, damping: 30 }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectConversation(conversation)}
              className={`relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer ${
                conversation.unread 
                  ? 'bg-gradient-to-r from-primary/10 via-card to-card border-l-4 border-l-primary border border-primary/20 shadow-lg shadow-primary/10' 
                  : 'bg-card/90 backdrop-blur-sm border border-border/50 shadow-md hover:shadow-lg hover:border-primary/30'
              }`}
            >
              {/* Unread indicator glow */}
              {conversation.unread && (
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
              )}
              
              <div className="relative p-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <motion.div 
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md ${
                        conversation.unread 
                          ? 'bg-gradient-golden' 
                          : 'bg-gradient-to-br from-gray-400 to-gray-500'
                      }`}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      {conversation.avatar}
                    </motion.div>
                    {conversation.online && (
                      <motion.div 
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card shadow-sm"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold truncate ${conversation.unread ? 'text-foreground' : 'text-foreground/80'}`}>
                          {conversation.name}
                        </h3>
                        {conversation.online && (
                          <span className="text-[10px] text-emerald-600 font-medium bg-emerald-100 px-1.5 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <span className={`text-xs flex-shrink-0 ml-2 ${
                        conversation.unread 
                          ? 'bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-semibold shadow-sm' 
                          : 'text-muted-foreground'
                      }`}>
                        {conversation.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!conversation.unread && (
                        <CheckCheck className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                      <p className={`text-sm truncate flex-1 ${conversation.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread && (
                        <motion.div 
                          className="w-3 h-3 rounded-full bg-primary flex-shrink-0 shadow-sm"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>
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
