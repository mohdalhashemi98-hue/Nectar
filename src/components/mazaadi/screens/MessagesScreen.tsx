import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Search, MessageSquare, Users, Sparkles, Circle, CheckCheck, Archive, Trash2 } from 'lucide-react';
import { Conversation, ScreenType, UserType } from '@/types/mazaadi';
import BottomNav from '../BottomNav';
import { toast } from 'sonner';
interface MessagesScreenProps {
  conversations: Conversation[];
  userType: UserType;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectConversation: (conversation: Conversation) => void;
}
interface SwipeableCardProps {
  conversation: Conversation;
  index: number;
  onSelect: () => void;
  onArchive: () => void;
}
const SwipeableCard = ({
  conversation,
  index,
  onSelect,
  onArchive
}: SwipeableCardProps) => {
  const x = useMotionValue(0);
  const background = useTransform(x, [-150, 0], ['#f59e0b', '#ffffff00']);
  const archiveOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const archiveScale = useTransform(x, [-150, -50, 0], [1, 0.8, 0.5]);
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -100) {
      onArchive();
    }
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: 0.2 + index * 0.05,
    type: 'spring',
    stiffness: 300,
    damping: 30
  }} className="relative overflow-hidden rounded-2xl">
      {/* Archive action background */}
      <motion.div style={{
      backgroundColor: background
    }} className="absolute inset-0 rounded-2xl flex items-center justify-end pr-6">
        <motion.div style={{
        opacity: archiveOpacity,
        scale: archiveScale
      }} className="flex flex-col items-center gap-1 text-primary-foreground">
          <Archive className="w-6 h-6" />
          <span className="text-xs font-medium">Archive</span>
        </motion.div>
      </motion.div>

      {/* Swipeable card */}
      <motion.div style={{
      x
    }} drag="x" dragConstraints={{
      left: -150,
      right: 0
    }} dragElastic={0.1} onDragEnd={handleDragEnd} whileTap={{
      cursor: 'grabbing'
    }} onClick={() => x.get() > -20 && onSelect()} className={`relative transition-shadow duration-300 cursor-pointer rounded-2xl ${conversation.unread ? 'bg-gradient-to-r from-primary/10 via-card to-card border-l-4 border-l-primary border border-primary/20 shadow-lg shadow-primary/10' : 'bg-card/90 backdrop-blur-sm border border-border/50 shadow-md hover:shadow-lg hover:border-primary/30'}`}>
        {/* Unread indicator glow */}
        {conversation.unread && <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 to-transparent pointer-events-none rounded-2xl" />}
        
        <div className="relative p-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <motion.div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md ${conversation.unread ? 'bg-gradient-golden' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`} whileHover={{
              rotate: [0, -5, 5, 0]
            }} transition={{
              duration: 0.4
            }}>
                {conversation.avatar}
              </motion.div>
              {conversation.online && <motion.div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card shadow-sm" animate={{
              scale: [1, 1.2, 1]
            }} transition={{
              duration: 2,
              repeat: Infinity
            }} />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold truncate ${conversation.unread ? 'text-foreground' : 'text-foreground/80'}`}>
                    {conversation.name}
                  </h3>
                  {conversation.online && <span className="text-[10px] text-emerald-600 font-medium bg-emerald-100 px-1.5 py-0.5 rounded-full">
                      Active
                    </span>}
                </div>
                <span className={`text-xs flex-shrink-0 ml-2 ${conversation.unread ? 'bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-semibold shadow-sm' : 'text-muted-foreground'}`}>
                  {conversation.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!conversation.unread && <CheckCheck className="w-4 h-4 text-primary flex-shrink-0" />}
                <p className={`text-sm truncate flex-1 ${conversation.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {conversation.lastMessage}
                </p>
                {conversation.unread && <motion.div className="w-3 h-3 rounded-full bg-primary flex-shrink-0 shadow-sm" animate={{
                scale: [1, 1.3, 1]
              }} transition={{
                duration: 1.5,
                repeat: Infinity
              }} />}
              </div>
            </div>
          </div>
        </div>

        {/* Swipe hint on first card */}
        {index === 0 && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: [0, 1, 0]
      }} transition={{
        delay: 1,
        duration: 2,
        repeat: 1
      }} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground flex items-center gap-1">
            <span>←</span>
            <span>Swipe</span>
          </motion.div>}
      </motion.div>
    </motion.div>;
};
const MessagesScreen = ({
  conversations,
  userType,
  onBack,
  onNavigate,
  onSelectConversation
}: MessagesScreenProps) => {
  const [visibleConversations, setVisibleConversations] = useState(conversations);
  const unreadCount = visibleConversations.filter(c => c.unread).length;
  const onlineCount = visibleConversations.filter(c => c.online).length;
  const handleArchive = (conversationId: number, conversationName: string) => {
    setVisibleConversations(prev => prev.filter(c => c.id !== conversationId));
    toast.success(`Archived chat with ${conversationName}`, {
      action: {
        label: 'Undo',
        onClick: () => setVisibleConversations(conversations)
      }
    });
  };
  return <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background pb-24">
      {/* Header */}
      <div className="bg-gradient-golden text-primary-foreground p-6 pb-40 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-0 w-36 h-36 bg-primary-foreground/10 rounded-full blur-2xl" />
        <div className="absolute top-1/3 left-1/2 w-24 h-24 bg-primary-foreground/5 rounded-full blur-xl" />
        
        {/* Honeycomb pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="honeycomb" width="20" height="20" patternUnits="userSpaceOnUse">
              <polygon points="10,0 20,5 20,15 10,20 0,15 0,5" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#honeycomb)" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: -10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="flex items-center gap-4 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-3xl font-bold tracking-tight">Messages</h1>
                <motion.div animate={{
                rotate: [0, 15, -15, 0]
              }} transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}>
                  <Sparkles className="w-5 h-5 text-primary-foreground/80" />
                </motion.div>
              </div>
              <p className="opacity-80 text-sm mt-1">
                {unreadCount > 0 ? `${unreadCount} unread conversations` : 'All caught up!'}
              </p>
            </div>
            <motion.div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/20 shadow-lg" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              <MessageSquare className="w-7 h-7" />
            </motion.div>
          </motion.div>

          {/* Stats Row - Redesigned */}
          <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} className="grid grid-cols-3 gap-3 mb-8">
            {/* Online Now - Warm Amber Design */}
            <motion.div className="bg-amber-800/80 backdrop-blur-sm rounded-2xl p-3 border border-amber-600/30 shadow-lg shadow-amber-900/30" whileHover={{
            scale: 1.03,
            y: -2
          }} transition={{
            duration: 0.2
          }}>
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-9 h-9 rounded-xl bg-amber-200/30 flex items-center justify-center relative">
                  <motion.div animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 0, 0.5]
                }} transition={{
                  duration: 2,
                  repeat: Infinity
                }} className="absolute w-6 h-6 rounded-full bg-amber-200/40" />
                  <motion.div animate={{
                  scale: [1, 1.2, 1]
                }} transition={{
                  duration: 1.5,
                  repeat: Infinity
                }} className="w-3.5 h-3.5 rounded-full bg-amber-200 shadow-sm" />
                </div>
                <p className="font-display text-2xl font-bold text-amber-100">{onlineCount}</p>
                <p className="text-[10px] text-amber-200/80 leading-tight font-medium">Online</p>
              </div>
            </motion.div>

            {/* Unread */}
            <motion.div className="bg-primary-foreground/15 backdrop-blur-sm rounded-2xl p-3 border border-primary-foreground/10" whileHover={{
            scale: 1.03,
            y: -2
          }} transition={{
            duration: 0.2
          }}>
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <p className="font-display text-2xl font-bold">{unreadCount}</p>
                <p className="text-[10px] opacity-70 leading-tight">Unread</p>
              </div>
            </motion.div>

            {/* Total Chats */}
            <motion.div className="bg-primary-foreground/15 backdrop-blur-sm rounded-2xl p-3 border border-primary-foreground/10" whileHover={{
            scale: 1.03,
            y: -2
          }} transition={{
            duration: 0.2
          }}>
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <p className="font-display text-2xl font-bold">{visibleConversations.length}</p>
                <p className="text-[10px] opacity-70 leading-tight">Total</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Search */}
          <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.15
        }} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60" />
            <input type="text" placeholder="Search conversations..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-primary-foreground/25 backdrop-blur-md placeholder:opacity-60 border border-primary-foreground/20 focus:outline-none focus:border-primary-foreground/40 focus:bg-primary-foreground/30 transition-all text-primary-foreground shadow-inner" />
          </motion.div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="px-4 -mt-6 space-y-3 relative z-10 pl-px my-[25px]">
        {visibleConversations.length === 0 ? <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} className="text-center py-16 bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-lg">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-amber-200/30 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No messages yet</h3>
            <p className="text-muted-foreground text-sm">Start a conversation with a vendor</p>
          </motion.div> : visibleConversations.map((conversation, index) => <SwipeableCard key={conversation.id} conversation={conversation} index={index} onSelect={() => onSelectConversation(conversation)} onArchive={() => handleArchive(conversation.id, conversation.name)} />)}
      </div>

      <BottomNav active="messages" userType={userType} onNavigate={onNavigate} />
    </div>;
};
export default MessagesScreen;