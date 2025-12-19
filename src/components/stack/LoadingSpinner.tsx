import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ size = 'md' }: LoadingSpinnerProps) => (
  <Loader2 
    className={`animate-spin text-primary ${
      size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
    }`} 
  />
);

export const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
    <div className="bg-card rounded-3xl p-6 flex flex-col items-center gap-3 shadow-xl animate-scale-in">
      <LoadingSpinner size="lg" />
      <span className="text-muted-foreground font-medium">Please wait...</span>
    </div>
  </div>
);

export default LoadingSpinner;
