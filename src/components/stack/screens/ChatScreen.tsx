import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Phone, Video, Image, Smile, CheckCheck, Check, Clock, BadgeCheck } from 'lucide-react';
import { Conversation, ScreenType, Message } from '@/types/stack';

interface ExtendedMessage extends Message {
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface ChatScreenProps {
  conversation: Conversation;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

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
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex gap-1 px-4 py-3"
  >
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        className="w-2 h-2 bg-primary/60 rounded-full"
      />
    ))}
  </motion.div>
);

const MessageStatus = ({ status }: { status: ExtendedMessage['status'] }) => {
  switch (status) {
    case 'sending':
      return <Clock className="w-3.5 h-3.5 text-primary-foreground/50" />;
    case 'sent':
      return <Check className="w-3.5 h-3.5 text-primary-foreground/70" />;
    case 'delivered':
      return <CheckCheck className="w-3.5 h-3.5 text-primary-foreground/70" />;
    case 'read':
      return <CheckCheck className="w-3.5 h-3.5 text-primary-foreground" />;
    default:
      return <CheckCheck className="w-3.5 h-3.5 text-primary-foreground/70" />;
  }
};

const ChatScreen = ({ conversation, onBack }: ChatScreenProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ExtendedMessage[]>(
    conversation.messages.map(m => ({ ...m, status: 'read' as const }))
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline] = useState(conversation.online);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const simulateVendorResponse = useCallback(() => {
    setIsTyping(true);
    
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
    }, 1500 + Math.random() * 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
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
      setMessages(prev => prev.map(msg => msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg));
    }, 300);
    
    setTimeout(() => {
      setMessages(prev => prev.map(msg => msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg));
    }, 800);
    
    setTimeout(() => simulateVendorResponse(), 1000 + Math.random() * 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {conversation.avatar}
              </div>
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-semibold text-foreground truncate">{conversation.name}</h2>
                <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground">
                {isTyping ? 'typing...' : isOnline ? 'Online' : 'Last seen recently'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <Phone className="w-5 h-5 text-foreground" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <Video className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Date Badge */}
        <div className="flex justify-center mb-4">
          <span className="px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground font-medium">
            Today
          </span>
        </div>

        <div className="space-y-3">
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            const isFirstInGroup = index === 0 || messages[index - 1]?.sender !== msg.sender;
            const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.sender !== msg.sender;
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* Vendor Avatar */}
                {!isUser && isLastInGroup && (
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold mr-2 flex-shrink-0 self-end">
                    {conversation.avatar}
                  </div>
                )}
                {!isUser && !isLastInGroup && <div className="w-8 mr-2" />}
                
                <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-2.5 ${
                      isUser
                        ? `bg-primary text-primary-foreground ${isFirstInGroup ? 'rounded-t-2xl' : 'rounded-t-lg'} ${isLastInGroup ? 'rounded-bl-2xl rounded-br-md' : 'rounded-b-lg'}`
                        : `bg-card border border-border text-foreground ${isFirstInGroup ? 'rounded-t-2xl' : 'rounded-t-lg'} ${isLastInGroup ? 'rounded-br-2xl rounded-bl-md' : 'rounded-b-lg'}`
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  </div>
                  {isLastInGroup && (
                    <div className={`flex items-center gap-1.5 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[11px] text-muted-foreground">{msg.time}</span>
                      {isUser && <MessageStatus status={msg.status} />}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {conversation.avatar}
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-md">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-background border-t border-border p-3 safe-area-pb">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
            <Image className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message..."
              className="w-full px-4 py-2.5 rounded-xl bg-secondary border-none focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all text-foreground placeholder:text-muted-foreground text-[15px]"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Smile className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </button>
          </div>

          <button
            onClick={message.trim() ? handleSend : undefined}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              message.trim()
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            <Send className={`w-5 h-5 ${message.trim() ? '' : 'opacity-50'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
