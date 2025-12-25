import { ReactNode, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  pullDistance: number;
  isRefreshing: boolean;
  isPulling: boolean;
  threshold?: number;
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
  className?: string;
  /** Optional skeleton component to show during refresh */
  refreshSkeleton?: ReactNode;
}

const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(({
  children,
  pullDistance,
  isRefreshing,
  isPulling,
  threshold = 80,
  handlers,
  className = '',
  refreshSkeleton
}, ref) => {
  const progress = Math.min(pullDistance / threshold, 1);
  const showIndicator = pullDistance > 10 || isRefreshing;
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Pull indicator */}
      <AnimatePresence>
        {showIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              y: Math.min(pullDistance - 40, 20)
            }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            style={{ top: 0 }}
          >
            <motion.div 
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${progress >= 1 || isRefreshing 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-muted-foreground'
                }
                shadow-lg transition-colors duration-200
              `}
              animate={isRefreshing ? { rotate: 360 } : { rotate: progress * 180 }}
              transition={isRefreshing 
                ? { duration: 0.8, repeat: Infinity, ease: 'linear' } 
                : { duration: 0 }
              }
            >
              <RefreshCw className="w-5 h-5" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable content */}
      <div
        ref={ref}
        {...handlers}
        className="h-full overflow-y-auto overscroll-contain"
        style={{
          transform: isPulling || isRefreshing ? `translateY(${pullDistance}px)` : undefined,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Show skeleton during refresh if provided */}
        {isRefreshing && refreshSkeleton ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {refreshSkeleton}
          </motion.div>
        ) : (
          children
        )}
      </div>
    </div>
  );
});

PullToRefresh.displayName = 'PullToRefresh';

export default PullToRefresh;
