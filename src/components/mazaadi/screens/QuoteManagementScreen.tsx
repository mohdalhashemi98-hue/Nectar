import { motion } from 'framer-motion';
import { 
  ArrowLeft, Star, Clock, CheckCircle, MessageCircle, User, 
  Briefcase, Shield, TrendingUp, ChevronRight, Award, Zap,
  DollarSign, ThumbsUp
} from 'lucide-react';
import { Job, Offer, ScreenType } from '@/types/mazaadi';
import { initialOffers, initialVendors } from '@/data/mazaadi-data';
import { useState } from 'react';
import { toast } from 'sonner';

interface QuoteManagementScreenProps {
  job: Job;
  onBack: () => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectVendorId: (vendorId: number) => void;
  onStartChatWithVendor: (vendorId: number) => void;
  onAcceptOffer: (offer: Offer) => void;
}

const QuoteManagementScreen = ({ 
  job, 
  onBack, 
  onNavigate, 
  onSelectVendorId,
  onStartChatWithVendor,
  onAcceptOffer 
}: QuoteManagementScreenProps) => {
  const [selectedOffers, setSelectedOffers] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'compare'>('list');
  
  // Get offers for this job (using mock data)
  const offers = initialOffers;
  
  const toggleOfferSelection = (offerId: number) => {
    setSelectedOffers(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : prev.length < 3 
          ? [...prev, offerId]
          : prev
    );
  };

  const selectedOfferData = offers.filter(o => selectedOffers.includes(o.id));

  const handleAcceptOffer = (offer: Offer) => {
    toast.success(`Offer from ${offer.vendor} accepted!`, {
      description: `${offer.price} AED - They will be notified immediately.`
    });
    onAcceptOffer(offer);
  };

  const handleViewProfile = (vendorId: number) => {
    onSelectVendorId(vendorId);
    onNavigate('vendor-profile');
  };

  const handleStartChat = (vendorId: number) => {
    onStartChatWithVendor(vendorId);
    onNavigate('chat');
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground p-6 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <button 
              onClick={onBack} 
              className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="font-display text-xl font-bold">Compare Quotes</h1>
              <p className="opacity-60 text-sm">{job.title}</p>
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3"
          >
            <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{offers.length}</p>
              <p className="text-xs opacity-80">Quotes Received</p>
            </div>
            <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{Math.min(...offers.map(o => o.price))} AED</p>
              <p className="text-xs opacity-80">Lowest Price</p>
            </div>
            <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-2xl font-bold">{Math.max(...offers.map(o => o.rating)).toFixed(1)}</p>
              <p className="text-xs opacity-80">Top Rating</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="px-4 py-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card/95 backdrop-blur-xl rounded-2xl p-1.5 border border-border flex gap-1"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Quotes
          </button>
          <button
            onClick={() => setViewMode('compare')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              viewMode === 'compare'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Compare
            {selectedOffers.length > 0 && (
              <span className="w-5 h-5 bg-white/20 rounded-full text-xs flex items-center justify-center">
                {selectedOffers.length}
              </span>
            )}
          </button>
        </motion.div>

        {viewMode === 'list' && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Tap the checkbox to select quotes for comparison (max 3)
          </p>
        )}
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="px-4 space-y-4">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className={`card-elevated p-4 relative ${
                selectedOffers.includes(offer.id) ? 'ring-2 ring-primary' : ''
              }`}
            >
              {/* Selection Checkbox */}
              <button
                onClick={() => toggleOfferSelection(offer.id)}
                className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedOffers.includes(offer.id)
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border hover:border-primary'
                }`}
              >
                {selectedOffers.includes(offer.id) && (
                  <CheckCircle className="w-4 h-4" />
                )}
              </button>

              {/* Vendor Info */}
              <div className="flex items-start gap-3 mb-4 pr-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-lg font-bold">
                  {offer.vendor.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{offer.vendor}</h3>
                    {offer.verified && (
                      <Shield className="w-4 h-4 text-info fill-info/20" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{offer.description}</p>
                </div>
              </div>

              {/* Key Stats Grid */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center p-2 bg-secondary rounded-xl">
                  <DollarSign className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-bold text-foreground">{offer.price}</p>
                  <p className="text-xs text-muted-foreground">AED</p>
                </div>
                <div className="text-center p-2 bg-secondary rounded-xl">
                  <Star className="w-4 h-4 mx-auto mb-1 text-primary fill-primary" />
                  <p className="text-sm font-bold text-foreground">{offer.rating}</p>
                  <p className="text-xs text-muted-foreground">{offer.reviews} reviews</p>
                </div>
                <div className="text-center p-2 bg-secondary rounded-xl">
                  <Zap className="w-4 h-4 mx-auto mb-1 text-warning" />
                  <p className="text-sm font-bold text-foreground">{offer.responseTime}</p>
                  <p className="text-xs text-muted-foreground">Response</p>
                </div>
                <div className="text-center p-2 bg-secondary rounded-xl">
                  <ThumbsUp className="w-4 h-4 mx-auto mb-1 text-success" />
                  <p className="text-sm font-bold text-foreground">{offer.completionRate}%</p>
                  <p className="text-xs text-muted-foreground">Success</p>
                </div>
              </div>

              {/* Vendor Message */}
              <div className="bg-secondary/50 rounded-xl p-3 mb-4">
                <p className="text-sm text-muted-foreground italic">"{offer.message}"</p>
              </div>

              {/* Availability Badge */}
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Available: </span>
                <span className="text-sm font-medium text-foreground">{offer.availability}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleViewProfile(offer.vendorId)}
                  className="py-2.5 px-3 bg-secondary text-foreground rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-secondary/80 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartChat(offer.vendorId)}
                  className="py-2.5 px-3 bg-secondary text-foreground rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-secondary/80 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAcceptOffer(offer)}
                  className="py-2.5 px-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Compare View */}
      {viewMode === 'compare' && (
        <div className="px-4">
          {selectedOfferData.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No Quotes Selected</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Switch to "All Quotes" and tap the checkboxes to select quotes for comparison.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('list')}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold"
              >
                View All Quotes
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* Comparison Headers */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-3"
                style={{ gridTemplateColumns: `repeat(${selectedOfferData.length}, 1fr)` }}
              >
                {selectedOfferData.map((offer, index) => (
                  <div 
                    key={offer.id}
                    className="card-elevated p-3 text-center"
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold mb-2">
                      {offer.vendor.charAt(0)}
                    </div>
                    <h4 className="font-semibold text-foreground text-sm truncate">{offer.vendor}</h4>
                    {offer.verified && (
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Shield className="w-3 h-3 text-info" />
                        <span className="text-xs text-info">Verified</span>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>

              {/* Comparison Rows */}
              {[
                { label: 'Price', key: 'price', format: (v: number) => `${v} AED`, icon: DollarSign, highlight: 'lowest' },
                { label: 'Rating', key: 'rating', format: (v: number) => v.toFixed(1), icon: Star, highlight: 'highest' },
                { label: 'Reviews', key: 'reviews', format: (v: number) => v.toString(), icon: Award, highlight: 'highest' },
                { label: 'Response Time', key: 'responseTime', format: (v: string) => v, icon: Clock, highlight: null },
                { label: 'Success Rate', key: 'completionRate', format: (v: number) => `${v}%`, icon: ThumbsUp, highlight: 'highest' },
              ].map((row, rowIndex) => {
                const values = selectedOfferData.map(o => o[row.key as keyof Offer]);
                const numericValues = values.filter(v => typeof v === 'number') as number[];
                const bestValue = row.highlight === 'lowest' 
                  ? Math.min(...numericValues) 
                  : row.highlight === 'highest' 
                    ? Math.max(...numericValues) 
                    : null;

                return (
                  <motion.div
                    key={row.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + rowIndex * 0.05 }}
                    className="bg-card rounded-2xl border border-border overflow-hidden"
                  >
                    <div className="px-4 py-2 bg-secondary flex items-center gap-2">
                      <row.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{row.label}</span>
                    </div>
                    <div 
                      className="grid"
                      style={{ gridTemplateColumns: `repeat(${selectedOfferData.length}, 1fr)` }}
                    >
                      {selectedOfferData.map((offer, index) => {
                        const value = offer[row.key as keyof Offer];
                        const isBest = bestValue !== null && value === bestValue;
                        
                        return (
                          <div 
                            key={offer.id}
                            className={`p-4 text-center border-r last:border-r-0 border-border ${
                              isBest ? 'bg-primary/10' : ''
                            }`}
                          >
                            <p className={`text-lg font-bold ${isBest ? 'text-primary' : 'text-foreground'}`}>
                              {row.format(value as never)}
                            </p>
                            {isBest && (
                              <span className="text-xs text-primary font-medium">Best</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}

              {/* Action Buttons for Each */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid gap-3 pt-2"
                style={{ gridTemplateColumns: `repeat(${selectedOfferData.length}, 1fr)` }}
              >
                {selectedOfferData.map((offer) => (
                  <motion.button
                    key={offer.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAcceptOffer(offer)}
                    className="py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </motion.button>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuoteManagementScreen;
