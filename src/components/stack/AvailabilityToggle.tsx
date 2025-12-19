import { useState } from 'react';
import { motion } from 'framer-motion';
import { Power, Wifi, WifiOff } from 'lucide-react';

interface AvailabilityToggleProps {
  initialAvailable?: boolean;
  onToggle?: (isAvailable: boolean) => void;
}

const AvailabilityToggle = ({ 
  initialAvailable = true, 
  onToggle 
}: AvailabilityToggleProps) => {
  const [isAvailable, setIsAvailable] = useState(initialAvailable);

  const handleToggle = () => {
    const newState = !isAvailable;
    setIsAvailable(newState);
    onToggle?.(newState);
  };

  return (
    <motion.button
      onClick={handleToggle}
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 ${
        isAvailable 
          ? 'bg-green-500/10 border-2 border-green-500/30' 
          : 'bg-destructive/10 border-2 border-destructive/30'
      }`}
    >
      <div className="flex items-center gap-3">
        <motion.div 
          animate={{ 
            backgroundColor: isAvailable ? 'rgb(34 197 94)' : 'rgb(239 68 68)',
            scale: isAvailable ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 0.3 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
        >
          {isAvailable ? (
            <Wifi className="w-5 h-5 text-white" />
          ) : (
            <WifiOff className="w-5 h-5 text-white" />
          )}
        </motion.div>
        <div className="text-left">
          <div className={`font-semibold text-sm ${isAvailable ? 'text-green-600' : 'text-destructive'}`}>
            {isAvailable ? "I'm Available for Jobs" : "Offline - No New Leads"}
          </div>
          <div className="text-xs text-muted-foreground">
            {isAvailable ? 'Receiving new job requests' : 'Hidden from matching'}
          </div>
        </div>
      </div>
      
      {/* Toggle Switch */}
      <div className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ${
        isAvailable ? 'bg-green-500' : 'bg-destructive'
      }`}>
        <motion.div
          animate={{ x: isAvailable ? 26 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
        >
          <Power className={`w-3 h-3 ${isAvailable ? 'text-green-500' : 'text-destructive'}`} />
        </motion.div>
      </div>
    </motion.button>
  );
};

export default AvailabilityToggle;