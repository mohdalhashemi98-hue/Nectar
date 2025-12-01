import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Phone, MoreVertical, Image, Paperclip, Mic, CheckCheck, Check, Clock, Shield } from 'lucide-react';
import { Conversation, ScreenType, Message } from '@/types/mazaadi';

interface ExtendedMessage extends Message {
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface ChatScreenProps {
  conversation: Conversation;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

// Simulated vendor responses
const vendorResponses = [
  "Great! I'll be there as scheduled.",
  "Thanks for reaching out. Let me check my availability.",
  "I can offer you a competitive price for this service.",
  "Yes, that works for me. See you then!",
  "I've completed similar jobs before. Don't worry, you're in good hands.",
  "I'll bring all the necessary equipment.",
  "Is there anything specific I should know before arriving?",
  "Perfect! I'll send you an update when I'm on my way."
];

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.9 }}
    className="flex justify-start"
  >
    <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
      <div className="flex items-center gap-1.5">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 bg-primary rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 bg-primary rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 bg-primary rounded-full"
        />
      </div>
    </div>
  </motion.div>
);

const MessageStatusIcon = ({ status }: { status: ExtendedMessage['status'] }) => {
  switch (status) {
    case 'sending':
      return <Clock className="w-3 h-3 text-primary-foreground/50 animate-pulse" />;
    case 'sent':
      return <Check className="w-3 h-3 text-primary-foreground/60" />;
    case 'delivered':
      return <CheckCheck className="w-3 h-3 text-primary-foreground/60" />;
    case 'read':
      return <CheckCheck className="w-3 h-3 text-primary-foreground" />;
    default:
      return <CheckCheck className="w-3 h-3 text-primary-foreground/60" />;
  }
};

const ChatScreen = ({ conversation, onBack, onNavigate }: ChatScreenProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ExtendedMessage[]>(
    conversation.messages.map(m => ({ ...m, status: 'read' as const }))
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(conversation.online);
  const [lastSeen, setLastSeen] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        setIsOnline(prev => !prev);
        if (!isOnline) {
          setLastSeen('just now');
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const simulateVendorResponse = useCallback(() => {
    setIsTyping(true);
    setIsOnline(true);
    
    const typingDuration = 1500 + Math.random() * 2500;
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      
      const randomResponse = vendorResponses[Math.floor(Math.random() * vendorResponses.length)];
      const vendorMessage: ExtendedMessage = {
        id: Date.now(),
        sender: 'vendor',
        text: randomResponse,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        status: 'read'
      };
      
      setMessages(prev => [...prev, vendorMessage]);
      
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === prev.length - 2 && msg.sender === 'user' 
            ? { ...msg, status: 'read' } 
            : msg
        )
      );
    }, typingDuration);
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMessage: ExtendedMessage = {
      id: Date.now(),
      sender: 'user',
      text: message.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 300);
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 800);
    
    setTimeout(() => {
      simulateVendorResponse();
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 via-background to-background flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 sticky top-0 z-10"
      >
        <div className="flex items-center gap-3">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-11 h-11 rounded-2xl bg-gradient-golden flex items-center justify-center text-primary-foreground font-bold shadow-lg"
                style={{ boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)' }}
              >
                {conversation.avatar}
              </motion.div>
              <AnimatePresence>
                {isOnline && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-card shadow-sm" 
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-foreground truncate">{conversation.name}</h2>
                <Shield className="w-4 h-4 text-primary flex-shrink-0" />
              </div>
              <AnimatePresence mode="wait">
                {isTyping ? (
                  <motion.p 
                    key="typing"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-primary font-medium"
                  >
                    typing...
                  </motion.p>
                ) : isOnline ? (
                  <motion.p 
                    key="online"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-success font-medium"
                  >
                    Online now
                  </motion.p>
                ) : (
                  <motion.p 
                    key="offline"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-muted-foreground"
                  >
                    {lastSeen ? `Last seen ${lastSeen}` : 'Last seen recently'}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-2xl bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Phone className="w-5 h-5 text-foreground" />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-2xl bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-foreground" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Date Separator */}
        <div className="flex items-center justify-center py-2">
          <span className="px-4 py-1.5 rounded-full bg-secondary/60 backdrop-blur-sm text-xs text-muted-foreground font-medium">
            Today
          </span>
        </div>

        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          const showAvatar = !isUser && (index === 0 || messages[index - 1]?.sender === 'user');
          
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Vendor Avatar */}
              {!isUser && (
                <div className={`w-8 h-8 rounded-xl flex-shrink-0 ${showAvatar ? 'visible' : 'invisible'}`}>
                  <div className="w-full h-full rounded-xl bg-gradient-golden flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {conversation.avatar}
                  </div>
                </div>
              )}
              
              <div className={`max-w-[75%] ${isUser ? 'order-1' : 'order-1'}`}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`px-4 py-2.5 ${
                    isUser
                      ? 'bg-gradient-golden text-primary-foreground rounded-2xl rounded-br-md shadow-lg'
                      : 'bg-card/90 backdrop-blur-sm border border-border/50 text-foreground rounded-2xl rounded-bl-md shadow-sm'
                  }`}
                  style={isUser ? { boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)' } : {}}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </motion.div>
                <div className={`flex items-center gap-1.5 mt-1 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[10px] text-muted-foreground font-medium">{msg.time}</span>
                  {isUser && <MessageStatusIcon status={msg.status} />}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-golden flex items-center justify-center text-primary-foreground text-xs font-bold">
                {conversation.avatar}
              </div>
              <TypingIndicator />
            </div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/80 backdrop-blur-xl border-t border-border/50 p-4 safe-area-pb"
      >
        <div className="flex items-end gap-2">
          <div className="flex gap-1.5">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-2xl bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Image className="w-5 h-5 text-muted-foreground" />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-2xl bg-secondary/80 flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </div>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 rounded-2xl bg-secondary/80 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={message.trim() ? handleSend : undefined}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              message.trim()
                ? 'bg-gradient-golden text-primary-foreground shadow-lg'
                : 'bg-secondary/80 text-muted-foreground'
            }`}
            style={message.trim() ? { boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)' } : {}}
          >
            {message.trim() ? (
              <Send className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatScreen;
