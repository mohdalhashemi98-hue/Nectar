import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, Mail, ChevronDown, Search, HelpCircle, FileText, Shield, CreditCard } from 'lucide-react';
import { ScreenType } from '@/types/stack';
import { ScreenHeader } from '@/components/shared';

interface HelpScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onBack: () => void;
}

const faqs = [
  {
    category: 'Getting Started', icon: HelpCircle,
    questions: [
      { q: 'How do I post a job?', a: 'Tap the "Post a Job" button on the home screen, select a service category, describe what you need, set your budget, and submit.' },
      { q: 'How do I choose the right professional?', a: 'Compare quotes using our comparison tool. Look at ratings, reviews, completed jobs, response time, and pricing.' }
    ]
  },
  {
    category: 'Payments & Pricing', icon: CreditCard,
    questions: [
      { q: 'How does payment work?', a: 'When you accept an offer, the payment is held in escrow. Once the job is completed to your satisfaction, the payment is released.' },
      { q: 'What payment methods are accepted?', a: 'We accept credit/debit cards, Apple Pay, and Stack Wallet. Cash payments are also available for select services.' },
      { q: 'Can I get a refund?', a: 'Yes, if the job is not completed or doesn\'t meet the agreed standards, you can request a refund within 24 hours.' }
    ]
  },
  {
    category: 'Trust & Safety', icon: Shield,
    questions: [
      { q: 'Are professionals verified?', a: 'Yes, all professionals on Stack go through ID verification, license checks, and background screening.' },
      { q: 'What if there\'s a problem?', a: 'Contact our support team immediately through the app. We offer protection on all bookings.' }
    ]
  },
  {
    category: 'Rewards & Points', icon: FileText,
    questions: [
      { q: 'How do I earn points?', a: 'Earn points with every completed job (5% of the job value), writing reviews (50 points each), and maintaining streaks.' },
      { q: 'What can I use points for?', a: 'Points can be redeemed for cashback on future bookings and exclusive discounts.' }
    ]
  }
];

const HelpScreen = ({ onNavigate, onBack }: HelpScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Getting Started');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const filteredFaqs = searchQuery
    ? faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || q.a.toLowerCase().includes(searchQuery.toLowerCase()))
      })).filter(cat => cat.questions.length > 0)
    : faqs;

  return (
    <div className="flex flex-col h-full bg-background">
      <ScreenHeader title="Help & Support" onBack={onBack} />

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" placeholder="Search help articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-modern pl-12" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-24 space-y-4">
        {/* Contact Options */}
        <div className="card-elevated p-5">
          <h2 className="font-semibold text-foreground mb-3">Need Quick Help?</h2>
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-secondary rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-secondary/80 transition-colors">
              <MessageCircle className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-foreground">Live Chat</span>
            </button>
            <button className="bg-secondary rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-secondary/80 transition-colors">
              <Phone className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-foreground">Call Us</span>
            </button>
            <button className="bg-secondary rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-secondary/80 transition-colors">
              <Mail className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-foreground">Email</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">Available 24/7 • Avg response: 2 min</p>
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Frequently Asked Questions</h2>
          {filteredFaqs.map((category, idx) => (
            <div key={category.category} className="bg-card rounded-xl border border-border overflow-hidden">
              <button onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)} className="w-full px-4 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground text-sm">{category.category}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedCategory === category.category ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedCategory === category.category && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="border-t border-border">
                      {category.questions.map((item, qIdx) => (
                        <div key={qIdx} className="border-b border-border last:border-0">
                          <button onClick={() => setExpandedQuestion(expandedQuestion === item.q ? null : item.q)} className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors">
                            <span className="text-sm text-foreground pr-4">{item.q}</span>
                            <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${expandedQuestion === item.q ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {expandedQuestion === item.q && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <p className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="bg-secondary/50 rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">Can't find what you're looking for?</p>
          <p className="text-sm text-foreground font-medium">Email us at <span className="text-primary">support@stack.ae</span></p>
        </div>
      </div>
    </div>
  );
};

export default HelpScreen;
