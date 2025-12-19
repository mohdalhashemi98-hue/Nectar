import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageCircle, Phone, Mail, ChevronDown, Search, HelpCircle, FileText, Shield, CreditCard } from 'lucide-react';
import { ScreenType } from '@/types/stack';

interface HelpScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

const faqs = [
  {
    category: 'Getting Started',
    icon: HelpCircle,
    questions: [
      {
        q: 'How do I post a job?',
        a: 'Tap the "Post a Job" button on the home screen, select a service category, describe what you need, set your budget, and submit. You\'ll start receiving quotes from verified professionals within minutes.'
      },
      {
        q: 'How do I choose the right professional?',
        a: 'Compare quotes using our comparison tool. Look at ratings, reviews, completed jobs, response time, and pricing. You can also chat with professionals before accepting an offer.'
      }
    ]
  },
  {
    category: 'Payments & Pricing',
    icon: CreditCard,
    questions: [
      {
        q: 'How does payment work?',
        a: 'When you accept an offer, the payment is held in escrow. Once the job is completed to your satisfaction, the payment is released to the professional. This protects both parties.'
      },
      {
        q: 'What payment methods are accepted?',
        a: 'We accept credit/debit cards, Apple Pay, and Stack Wallet. Cash payments are also available for select services.'
      },
      {
        q: 'Can I get a refund?',
        a: 'Yes, if the job is not completed or doesn\'t meet the agreed standards, you can request a refund. Our support team will review your case within 24 hours.'
      }
    ]
  },
  {
    category: 'Trust & Safety',
    icon: Shield,
    questions: [
      {
        q: 'Are professionals verified?',
        a: 'Yes, all professionals on Stack go through a verification process that includes ID verification, license checks (where applicable), and background screening.'
      },
      {
        q: 'What if there\'s a problem with my job?',
        a: 'Contact our support team immediately through the app. We offer protection on all bookings and will help resolve any issues.'
      }
    ]
  },
  {
    category: 'Rewards & Points',
    icon: FileText,
    questions: [
      {
        q: 'How do I earn points?',
        a: 'Earn points with every completed job (5% of the job value), writing reviews (50 points each), maintaining streaks, and completing weekly challenges.'
      },
      {
        q: 'What can I use points for?',
        a: 'Points can be redeemed for cashback on future bookings, exclusive discounts, and special offers from our partners.'
      }
    ]
  }
];

const HelpScreen = ({ onNavigate }: HelpScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Getting Started');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const filteredFaqs = searchQuery
    ? faqs.map(cat => ({
        ...cat,
        questions: cat.questions.filter(
          q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
               q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.questions.length > 0)
    : faqs;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => onNavigate('consumer-home')}
            className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-xl font-bold text-foreground">Help & Support</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-modern pl-12"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-golden text-primary-foreground rounded-3xl p-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-foreground/10 rounded-full blur-2xl" />
          
          <h2 className="font-display text-lg font-bold mb-3 relative z-10">Need Quick Help?</h2>
          
          <div className="grid grid-cols-3 gap-3 relative z-10">
            <button className="bg-primary-foreground/20 rounded-2xl p-3 flex flex-col items-center gap-2 hover:bg-primary-foreground/30 transition-colors">
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Live Chat</span>
            </button>
            <button className="bg-primary-foreground/20 rounded-2xl p-3 flex flex-col items-center gap-2 hover:bg-primary-foreground/30 transition-colors">
              <Phone className="w-6 h-6" />
              <span className="text-xs font-medium">Call Us</span>
            </button>
            <button className="bg-primary-foreground/20 rounded-2xl p-3 flex flex-col items-center gap-2 hover:bg-primary-foreground/30 transition-colors">
              <Mail className="w-6 h-6" />
              <span className="text-xs font-medium">Email</span>
            </button>
          </div>
          
          <p className="text-xs opacity-70 text-center mt-3 relative z-10">
            Available 24/7 • Average response: 2 minutes
          </p>
        </motion.div>

        {/* FAQs */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-bold text-foreground">Frequently Asked Questions</h2>
          
          {filteredFaqs.map((category, idx) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(
                  expandedCategory === category.category ? null : category.category
                )}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground">{category.category}</span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    expandedCategory === category.category ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Questions */}
              <AnimatePresence>
                {expandedCategory === category.category && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border">
                      {category.questions.map((item, qIdx) => (
                        <div key={qIdx} className="border-b border-border last:border-0">
                          <button
                            onClick={() => setExpandedQuestion(
                              expandedQuestion === item.q ? null : item.q
                            )}
                            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
                          >
                            <span className="text-sm text-foreground pr-4">{item.q}</span>
                            <ChevronDown 
                              className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                                expandedQuestion === item.q ? 'rotate-180' : ''
                              }`} 
                            />
                          </button>
                          
                          <AnimatePresence>
                            {expandedQuestion === item.q && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <p className="px-4 pb-4 text-sm text-muted-foreground">
                                  {item.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary/50 rounded-2xl p-4 text-center"
        >
          <p className="text-sm text-muted-foreground mb-2">
            Can't find what you're looking for?
          </p>
          <p className="text-sm text-foreground font-medium">
            Email us at <span className="text-primary">support@nectar.ae</span>
          </p>
          <p className="text-sm text-foreground font-medium">
            or call <span className="text-primary">800-NECTAR</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpScreen;
