import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface LocationStepProps {
  location: string;
  serviceRadius: number;
  onUpdate: (updates: Partial<{ location: string; serviceRadius: number }>) => void;
  onNext: () => void;
  onBack: () => void;
}

const LocationStep: React.FC<LocationStepProps> = ({ location, serviceRadius, onUpdate, onNext, onBack }) => {
  const handleUseCurrentLocation = () => {
    // Mock current location
    onUpdate({ location: 'Dubai Marina, Dubai, UAE' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center p-4 border-b border-border/50"
      >
        <button 
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center font-display text-xl font-bold pr-10">Service Area</h1>
      </motion.div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Where do you work?
          </h2>
          <p className="text-muted-foreground">
            Set your service area to match with nearby customers
          </p>
        </motion.div>

        {/* Mock Map */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full aspect-square max-w-sm mx-auto mb-8 rounded-3xl overflow-hidden bg-muted"
        >
          {/* Map Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5">
            <svg className="w-full h-full opacity-20" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Service Radius Circle */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/30 bg-primary/10"
            initial={{ width: 0, height: 0 }}
            animate={{ 
              width: `${Math.min(serviceRadius * 6, 90)}%`, 
              height: `${Math.min(serviceRadius * 6, 90)}%` 
            }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
          
          {/* Center Pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45" />
            </motion.div>
          </div>
          
          {/* Radius Label */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-card/90 backdrop-blur-sm rounded-full shadow-lg"
          >
            <span className="text-sm font-semibold text-foreground">{serviceRadius} km radius</span>
          </motion.div>
        </motion.div>

        {/* Location Input */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mb-8"
        >
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Your Base Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => onUpdate({ location: e.target.value })}
                className="pl-12 pr-12 h-14 rounded-2xl"
              />
              <button 
                onClick={handleUseCurrentLocation}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors"
              >
                <Navigation className="w-5 h-5" />
              </button>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleUseCurrentLocation}
            className="w-full h-12 rounded-2xl gap-2"
          >
            <Navigation className="w-4 h-4" />
            Use current location
          </Button>
        </motion.div>

        {/* Radius Slider */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">Service Radius</label>
            <span className="text-sm font-bold text-primary">{serviceRadius} km</span>
          </div>
          
          <Slider
            value={[serviceRadius]}
            onValueChange={(value) => onUpdate({ serviceRadius: value[0] })}
            min={1}
            max={50}
            step={1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 km</span>
            <span>25 km</span>
            <span>50 km</span>
          </div>
        </motion.div>
      </div>

      {/* Next Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 pb-8 border-t border-border/50"
      >
        <Button
          onClick={onNext}
          disabled={!location}
          className="w-full h-14 rounded-2xl text-lg font-semibold"
        >
          Continue
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};

export default LocationStep;
