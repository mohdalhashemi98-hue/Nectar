import { ArrowLeft, Search, MessageSquare, Sparkles, Users } from 'lucide-react';
import { Conversation, ScreenType } from '@/types/mazaadi';

interface MessagesScreenProps {
  conversations: Conversation[];
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectConversation: (conversation: Conversation) => void;
}

const MessagesScreen = ({ conversations, onBack, onNavigate, onSelectConversation }: MessagesScreenProps) => {
  const unreadCount = conversations.filter(c => c.unread).length;
  const onlineCount = conversations.filter(c => c.online).length;

  const getAvatarGradient = (index: number) => {
    const gradients = [
      'from-violet-500 to-purple-600',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-500',
      'from-amber-500 to-orange-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-blue-950/5">
      {/* Header with decorative elements */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white p-6 pb-20 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-pink-400/20 rounded-full blur-lg" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                Messages
              </h1>
              <p className="text-white/70 text-sm">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold">{onlineCount}</p>
                  <p className="text-[10px] text-white/70">Online</p>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold">{unreadCount}</p>
                  <p className="text-[10px] text-white/70">Unread</p>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold">{conversations.length}</p>
                  <p className="text-[10px] text-white/70">Chats</p>
                </div>
              </div>
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
      </div>

      {/* Conversations List */}
      <div className="p-4 -mt-6 space-y-2 relative z-10">
        {conversations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No messages yet</h3>
            <p className="text-muted-foreground text-sm">Start a conversation with a vendor</p>
          </div>
        ) : (
          conversations.map((conversation, index) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation)}
              className={`bg-card/95 backdrop-blur-sm rounded-2xl p-4 border transition-all cursor-pointer group animate-fade-in shadow-sm hover:shadow-lg ${
                conversation.unread 
                  ? 'border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-indigo-500/5' 
                  : 'border-border hover:border-blue-500/20'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${getAvatarGradient(index)} shadow-lg`}>
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card shadow-lg shadow-emerald-500/50" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold truncate ${conversation.unread ? 'text-foreground' : 'text-foreground/80'}`}>
                      {conversation.name}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      conversation.unread 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium' 
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
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex-shrink-0 shadow-lg shadow-blue-500/50" />
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
