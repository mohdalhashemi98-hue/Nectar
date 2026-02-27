import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, MapPin, Clock, Users, Sparkles, ChevronDown, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { ScreenType } from '@/types/stack';
import { categories } from '@/data/stack-data';
import BottomNav from '../BottomNav';
import { ScreenHeader } from '@/components/shared';

interface MarketBenchmarkScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectCategory: (category: string) => void;
  onResetRequestForm: () => void;
}

const neighborhoods = ['Dubai Marina', 'Downtown Dubai', 'Business Bay', 'JBR', 'Palm Jumeirah', 'Deira', 'Bur Dubai', 'JLT', 'Al Barsha', 'Jumeirah'];

const generateBenchmarkData = (category: string, location: string) => {
  const basePrice = categories.find(c => c.name === category)?.avgPrice || '200 AED';
  const basePriceNum = parseInt(basePrice.replace(/[^0-9]/g, ''));
  const minPrice = Math.round(basePriceNum * 0.7);
  const maxPrice = Math.round(basePriceNum * 1.4);
  const avgPrice = Math.round((minPrice + maxPrice) / 2);
  const availability = 85 + Math.floor((category.length + location.length) % 15);
  const responseTime = 15 + Math.floor((category.length * location.length) % 30);
  const confidence = 78 + Math.floor((category.length + location.length) % 18);
  return { minPrice, avgPrice, maxPrice, availability, responseTime, confidence, activeVendors: 12 + (category.length % 20), totalJobs: 150 + (location.length * 10) };
};

const MarketBenchmarkScreen = ({ onNavigate, onSelectCategory, onResetRequestForm }: MarketBenchmarkScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState<ReturnType<typeof generateBenchmarkData> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!selectedCategory || !selectedLocation) return;
    setIsAnalyzing(true);
    setTimeout(() => { setBenchmarkData(generateBenchmarkData(selectedCategory, selectedLocation)); setIsAnalyzing(false); }, 1500);
  };

  const handlePostJob = () => {
    onSelectCategory(selectedCategory);
    onResetRequestForm();
    onNavigate('job-configuration');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ScreenHeader title="Market Benchmark" subtitle="AI-powered pricing insights" icon={TrendingUp} />

      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        {/* Selection Card */}
        <div className="card-elevated p-5 mb-4">
          <h2 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Get Pricing Insights
          </h2>
          <p className="text-sm text-muted-foreground mb-5">Select a service and location to see real-time market data.</p>

          {/* Category Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">Service Category</label>
            <div className="relative">
              <button onClick={() => setShowCategoryDropdown(!showCategoryDropdown)} className="w-full px-4 py-3 bg-secondary rounded-xl flex items-center justify-between text-left transition-all border border-transparent hover:border-primary/20">
                <span className={selectedCategory ? 'text-foreground font-medium' : 'text-muted-foreground'}>{selectedCategory || 'Select a service...'}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showCategoryDropdown && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-20 w-full mt-2 bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: 'var(--shadow-lg)', maxHeight: '200px', overflowY: 'auto' }}>
                    {categories.map((cat) => (
                      <button key={cat.name} onClick={() => { setSelectedCategory(cat.name); setShowCategoryDropdown(false); setBenchmarkData(null); }} className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center justify-between">
                        <span className="text-foreground text-sm">{cat.name}</span>
                        {selectedCategory === cat.name && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Location Selector */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-foreground mb-2">Neighborhood</label>
            <div className="relative">
              <button onClick={() => setShowLocationDropdown(!showLocationDropdown)} className="w-full px-4 py-3 bg-secondary rounded-xl flex items-center justify-between text-left transition-all border border-transparent hover:border-primary/20">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className={selectedLocation ? 'text-foreground font-medium' : 'text-muted-foreground'}>{selectedLocation || 'Select a location...'}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showLocationDropdown && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-20 w-full mt-2 bg-card rounded-xl border border-border overflow-hidden" style={{ boxShadow: 'var(--shadow-lg)', maxHeight: '200px', overflowY: 'auto' }}>
                    {neighborhoods.map((loc) => (
                      <button key={loc} onClick={() => { setSelectedLocation(loc); setShowLocationDropdown(false); setBenchmarkData(null); }} className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center justify-between">
                        <span className="text-foreground text-sm">{loc}</span>
                        {selectedLocation === loc && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button onClick={handleAnalyze} disabled={!selectedCategory || !selectedLocation || isAnalyzing} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
            {isAnalyzing ? (<><Sparkles className="w-5 h-5 animate-spin" /> Analyzing...</>) : (<><TrendingUp className="w-5 h-5" /> Get Market Insights</>)}
          </button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {benchmarkData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="flex items-center justify-center gap-2 py-2">
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-semibold">AI Confidence: {benchmarkData.confidence}%</span>
                </div>
              </div>

              {/* Price Range */}
              <div className="card-elevated p-5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Market Price Range</h3>
                <div className="flex items-end justify-between mb-3">
                  <div className="text-center flex-1"><p className="text-xs text-muted-foreground mb-1">Min</p><p className="text-xl font-bold text-foreground">{benchmarkData.minPrice} <span className="text-sm font-normal text-muted-foreground">AED</span></p></div>
                  <div className="text-center flex-1"><p className="text-xs text-muted-foreground mb-1">Avg</p><p className="text-3xl font-bold text-primary">{benchmarkData.avgPrice} <span className="text-sm font-normal text-muted-foreground">AED</span></p></div>
                  <div className="text-center flex-1"><p className="text-xs text-muted-foreground mb-1">Max</p><p className="text-xl font-bold text-foreground">{benchmarkData.maxPrice} <span className="text-sm font-normal text-muted-foreground">AED</span></p></div>
                </div>
                <div className="bg-secondary rounded-full h-2 overflow-hidden"><div className="bg-primary h-full rounded-full" style={{ width: '60%', marginLeft: '20%' }} /></div>
                <p className="text-xs text-center text-muted-foreground mt-2">Based on {benchmarkData.totalJobs}+ jobs in {selectedLocation}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="card-elevated p-4">
                  <div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Availability</span></div>
                  <p className="text-2xl font-bold text-foreground">{benchmarkData.availability}%</p>
                  <p className="text-xs text-muted-foreground">{benchmarkData.activeVendors} active pros</p>
                </div>
                <div className="card-elevated p-4">
                  <div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Avg Response</span></div>
                  <p className="text-2xl font-bold text-foreground">{benchmarkData.responseTime} <span className="text-sm font-normal">min</span></p>
                </div>
              </div>

              <button onClick={handlePostJob} className="w-full btn-primary flex items-center justify-center gap-2 py-4">
                Post My Job and Get Quotes <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!benchmarkData && !isAnalyzing && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Know Before You Post</h3>
            <p className="text-sm text-muted-foreground">Select a service and location to see pricing data.</p>
          </div>
        )}
      </div>

      <BottomNav active="benchmark" userType="consumer" onNavigate={onNavigate} pendingQuotes={1} unreadMessages={2} />
    </div>
  );
};

export default MarketBenchmarkScreen;
