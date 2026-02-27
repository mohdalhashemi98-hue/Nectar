import { useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

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
    <button
      onClick={handleToggle}
      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
        isAvailable 
          ? 'bg-success/5 border border-success/20' 
          : 'bg-destructive/5 border border-destructive/20'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          isAvailable ? 'bg-success' : 'bg-destructive'
        }`}>
          {isAvailable ? (
            <Wifi className="w-4 h-4 text-white" />
          ) : (
            <WifiOff className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="text-left">
          <div className={`font-semibold text-sm ${isAvailable ? 'text-success' : 'text-destructive'}`}>
            {isAvailable ? "Available for Jobs" : "Offline"}
          </div>
          <div className="text-xs text-muted-foreground">
            {isAvailable ? 'Receiving new requests' : 'Hidden from matching'}
          </div>
        </div>
      </div>
      
      <div className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ${
        isAvailable ? 'bg-success' : 'bg-muted'
      }`}>
        <div
          className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            isAvailable ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
};

export default AvailabilityToggle;
