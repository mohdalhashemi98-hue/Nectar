import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, MapPin, Clock, Users, Sparkles, ChevronDown, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { ScreenType } from '@/types/mazaadi';
import { categories } from '@/data/mazaadi-data';
import BottomNav from '../BottomNav';

interface MarketBenchmarkScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectCategory: (category: string) => void;
  onResetRequestForm: () => void;
}

// Mock neighborhoods for Dubai
const neighborhoods = [
  'Dubai Marina',
  'Downtown Dubai',
  'Business Bay',
  'JBR',
  'Palm Jumeirah',
  'Deira',
  'Bur Dubai',
  'JLT',
  'Al Barsha',
  'Jumeirah'
];

// Generate mock benchmark data based on category and location
const generateBenchmarkData = (category: string, location: string) => {
  // Use category and location to generate somewhat consistent mock data
  const basePrice = categories.find(c => c.name === category)?.avgPrice || '200 AED';
  const basePriceNum = parseInt(basePrice.replace(/[^0-9]/g, ''));
  
  const minPrice = Math.round(basePriceNum * 0.7);
  const maxPrice = Math.round(basePriceNum * 1.4);
  const avgPrice = Math.round((minPrice + maxPrice) / 2);
  
  // Random but consistent values
  const availability = 85 + Math.floor((category.length + location.length) % 15);
  const responseTime = 15 + Math.floor((category.length * location.length) % 30);
  const confidence = 78 + Math.floor((category.length + location.length) % 18);
  
  return {
    minPrice,
    avgPrice,
    maxPrice,
    availability,
    responseTime,
    confidence,
    activeVendors: 12 + (category.length % 20),
    totalJobs: 150 + (location.length * 10)
  };
};

const MarketBenchmarkScreen = ({
  onNavigate,
  onSelectCategory,
  onResetRequestForm
}: MarketBenchmarkScreenProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState<ReturnType<typeof generateBenchmarkData> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!selectedCategory || !selectedLocation) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis time
    setTimeout(() => {
      setBenchmarkData(generateBenchmarkData(selectedCategory, selectedLocation));
      setIsAnalyzing(false);
    }, 1500);
  };

  const handlePostJob = () => {
    onSelectCategory(selectedCategory);
    onResetRequestForm();
    onNavigate('post-request');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground p-6 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-foreground/10 rounded-full blur-2xl" />
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">Market Benchmark</h1>
              <p className="text-sm opacity-80">AI-powered pricing insights</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 -mt-4">
        {/* Selection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl border border-border p-5 mb-4"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">Get Pricing Insights</h2>
          </div>
          
          <p className="text-sm text-muted-foreground mb-5">
            Select a service and location to see real-time market data powered by AI analysis.
          </p>

          {/* Category Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">Service Category</label>
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full px-4 py-3 bg-secondary rounded-2xl flex items-center justify-between text-left transition-all border border-transparent hover:border-primary/30"
              >
                <span className={selectedCategory ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                  {selectedCategory || 'Select a service...'}
                </span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showCategoryDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-20 w-full mt-2 bg-card rounded-2xl border border-border overflow-hidden"
                    style={{ boxShadow: 'var(--shadow-lg)', maxHeight: '200px', overflowY: 'auto' }}
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setShowCategoryDropdown(false);
                          setBenchmarkData(null);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center justify-between"
                      >
                        <span className="text-foreground">{cat.name}</span>
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
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="w-full px-4 py-3 bg-secondary rounded-2xl flex items-center justify-between text-left transition-all border border-transparent hover:border-primary/30"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className={selectedLocation ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                    {selectedLocation || 'Select a location...'}
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showLocationDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-20 w-full mt-2 bg-card rounded-2xl border border-border overflow-hidden"
                    style={{ boxShadow: 'var(--shadow-lg)', maxHeight: '200px', overflowY: 'auto' }}
                  >
                    {neighborhoods.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setShowLocationDropdown(false);
                          setBenchmarkData(null);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center justify-between"
                      >
                        <span className="text-foreground">{loc}</span>
                        {selectedLocation === loc && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!selectedCategory || !selectedLocation || isAnalyzing}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                Analyzing Market...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                Get Market Insights
              </>
            )}
          </button>
        </motion.div>

        {/* Benchmark Results */}
        <AnimatePresence>
          {benchmarkData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* AI Confidence Badge */}
              <div className="flex items-center justify-center gap-2 py-2">
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-semibold">AI Confidence: {benchmarkData.confidence}%</span>
                </div>
              </div>

              {/* Price Range Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-golden text-primary-foreground rounded-3xl p-5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-foreground/10 rounded-full blur-2xl" />
                
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="font-display text-lg font-bold">Market Price Range</h3>
                </div>
                
                <div className="flex items-end justify-between mb-3">
                  <div className="text-center flex-1">
                    <p className="text-xs opacity-70 mb-1">Minimum</p>
                    <p className="text-xl font-bold">{benchmarkData.minPrice} <span className="text-sm opacity-80">AED</span></p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-xs opacity-70 mb-1">Average</p>
                    <p className="text-3xl font-bold">{benchmarkData.avgPrice} <span className="text-sm opacity-80">AED</span></p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-xs opacity-70 mb-1">Maximum</p>
                    <p className="text-xl font-bold">{benchmarkData.maxPrice} <span className="text-sm opacity-80">AED</span></p>
                  </div>
                </div>
                
                {/* Price bar visualization */}
                <div className="bg-primary-foreground/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary-foreground h-full rounded-full"
                    style={{ width: '60%', marginLeft: '20%' }}
                  />
                </div>
                <p className="text-xs text-center opacity-70 mt-2">
                  Based on {benchmarkData.totalJobs}+ jobs in {selectedLocation}
                </p>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-2xl p-4 border border-border"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Vendor Availability</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{benchmarkData.availability}%</p>
                  <p className="text-xs text-muted-foreground">{benchmarkData.activeVendors} active pros</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card rounded-2xl p-4 border border-border"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Avg Response Time</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{benchmarkData.responseTime} <span className="text-sm font-normal">min</span></p>
                  <p className="text-xs text-muted-foreground">Average quote time</p>
                </motion.div>
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={handlePostJob}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                >
                  Post My Job and Get Quotes Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  Get real quotes from verified professionals
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State when no analysis yet */}
        {!benchmarkData && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Know Before You Post</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Select a service and location above to see what others are paying in your area.
            </p>
          </motion.div>
        )}
      </div>

      <BottomNav active="benchmark" userType="consumer" onNavigate={onNavigate} pendingQuotes={1} unreadMessages={2} />
    </div>
  );
};

export default MarketBenchmarkScreen;
