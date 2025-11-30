import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Phone, MoreVertical, Image, Paperclip, Smile, CheckCheck } from 'lucide-react';
import { Conversation, ScreenType } from '@/types/mazaadi';

interface ChatScreenProps {
  conversation: Conversation;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
}

const ChatScreen = ({ conversation, onBack, onNavigate }: ChatScreenProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(conversation.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'user' as const,
      text: message.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b border-border p-4 flex items-center gap-4 sticky top-0 z-10"
      >
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center text-background font-bold">
              {conversation.avatar}
            </div>
            {conversation.online && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-card" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate">{conversation.name}</h2>
            <p className="text-xs text-muted-foreground">
              {conversation.online ? (
                <span className="text-success font-medium">Online</span>
              ) : (
                'Last seen recently'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
            <Phone className="w-5 h-5 text-foreground" />
          </button>
          <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
            <MoreVertical className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date Separator */}
        <div className="flex items-center justify-center">
          <span className="px-4 py-1.5 rounded-full bg-secondary text-xs text-muted-foreground">
            Today
          </span>
        </div>

        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`px-4 py-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-foreground text-background rounded-br-md'
                    : 'bg-card border border-border text-foreground rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
              <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                {msg.sender === 'user' && (
                  <CheckCheck className="w-3.5 h-3.5 text-foreground/60" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-t border-border p-4 safe-area-pb"
      >
        <div className="flex items-end gap-3">
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <Image className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 pr-12 rounded-2xl bg-secondary border border-border focus:border-foreground/30 focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Smile className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!message.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              message.trim()
                ? 'bg-foreground text-background'
                : 'bg-secondary text-muted-foreground'
            }`}
            style={{ boxShadow: message.trim() ? 'var(--shadow-md)' : 'none' }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatScreen;