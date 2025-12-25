import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { categories } from '@/data/stack-data';

interface HookStepProps {
  selectedTrades: string[];
  onTradeToggle: (trade: string) => void;
  onNext: () => void;
}

const HookStep: React.FC<HookStepProps> = ({ selectedTrades, onTradeToggle, onNext }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const trades = categories.map(cat => ({
    name: cat.name,
    icon: cat.icon,
    jobs: cat.jobs,
  }));

  const filteredTrades = trades.filter(trade => 
    trade.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 pb-8 px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg"
        >
          <Briefcase className="w-12 h-12 text-primary-foreground" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-3xl font-bold text-foreground mb-3"
        >
          Turn your skills into a business
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-lg"
        >
          Join thousands of professionals earning on Stack
        </motion.p>
      </motion.div>

      {/* Trade Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex-1 px-4 pb-6"
      >
        <div className="bg-card rounded-3xl shadow-lg overflow-hidden border border-border/50">
          <div className="p-4 border-b border-border/50">
            <h2 className="font-semibold text-foreground text-lg">What are your primary trades?</h2>
            <p className="text-sm text-muted-foreground mt-1">Select all services you specialize in</p>
          </div>
          
          {/* Search Input */}
          <div className="flex items-center border-b border-border/50 px-4 py-3">
            <Search className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search trades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          
          {/* Trades List */}
          <ScrollArea className="h-[320px]">
            <div className="p-2">
              {filteredTrades.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No trade found.
                </div>
              ) : (
                filteredTrades.map((trade) => (
                  <button
                    key={trade.name}
                    onClick={() => onTradeToggle(trade.name)}
                    className={`w-full flex items-center justify-between py-4 px-4 rounded-xl cursor-pointer transition-colors ${
                      selectedTrades.includes(trade.name) 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selectedTrades.includes(trade.name) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="font-medium">{trade.name}</span>
                        <p className="text-xs text-muted-foreground">{trade.jobs.toLocaleString()} jobs available</p>
                      </div>
                    </div>
                    {selectedTrades.includes(trade.name) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <ChevronRight className="w-4 h-4 text-primary-foreground" />
                      </motion.div>
                    )}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </motion.div>

      {/* Selected Count & Next Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-4 pb-8"
      >
        {selectedTrades.length > 0 && (
          <p className="text-center text-sm text-muted-foreground mb-3">
            {selectedTrades.length} trade{selectedTrades.length > 1 ? 's' : ''} selected
          </p>
        )}
        <Button
          onClick={onNext}
          disabled={selectedTrades.length === 0}
          className="w-full h-14 rounded-2xl text-lg font-semibold"
        >
          Continue
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};

export default HookStep;
