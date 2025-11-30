import { ArrowLeft, Search, MessageSquare, Circle } from 'lucide-react';
import { Conversation, ScreenType } from '@/types/mazaadi';

interface MessagesScreenProps {
  conversations: Conversation[];
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectConversation: (conversation: Conversation) => void;
}

const MessagesScreen = ({ conversations, onBack, onNavigate, onSelectConversation }: MessagesScreenProps) => {
  const unreadCount = conversations.filter(c => c.unread).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-mazaadi text-white p-6 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">Messages</h1>
            <p className="text-white/80 text-sm">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/20 backdrop-blur-sm text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:border-white/40 transition-colors"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="p-4 -mt-4 space-y-2">
        {conversations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-mazaadi/10 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-mazaadi-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No messages yet</h3>
            <p className="text-muted-foreground text-sm">Start a conversation with a vendor</p>
          </div>
        ) : (
          conversations.map((conversation, index) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`bg-card rounded-2xl p-4 border transition-all cursor-pointer group animate-fade-in ${
                conversation.unread 
                  ? 'border-mazaadi-primary/30 bg-mazaadi-primary/5' 
                  : 'border-border hover:border-mazaadi-primary/20'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    conversation.online ? 'bg-gradient-mazaadi' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold truncate ${conversation.unread ? 'text-foreground' : 'text-foreground/80'}`}>
                      {conversation.name}
                    </h3>
                    <span className={`text-xs ${conversation.unread ? 'text-mazaadi-primary font-medium' : 'text-muted-foreground'}`}>
                      {conversation.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm truncate flex-1 ${conversation.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread && (
                      <div className="w-2.5 h-2.5 rounded-full bg-mazaadi-primary flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesScreen;
