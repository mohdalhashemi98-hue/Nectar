import { useState, useRef, useCallback, useEffect } from 'react';
import { useHaptic } from './use-haptic';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  maxPull?: number;
}

interface UsePullToRefreshReturn {
  pullDistance: number;
  isRefreshing: boolean;
  isPulling: boolean;
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
  containerRef: React.RefObject<HTMLDivElement>;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  maxPull = 120
}: UsePullToRefreshOptions): UsePullToRefreshReturn => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const haptic = useHaptic();

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (isRefreshing) return;
    
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;
    
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  }, [isRefreshing]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;
    
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) {
      setPullDistance(0);
      return;
    }
    
    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;
    
    if (diff > 0) {
      // Apply resistance to the pull
      const resistance = 0.5;
      const pull = Math.min(diff * resistance, maxPull);
      setPullDistance(pull);
      
      // Trigger haptic when crossing threshold
      if (pull >= threshold && pullDistance < threshold) {
        haptic.trigger('medium');
      }
    }
  }, [isPulling, isRefreshing, maxPull, threshold, pullDistance, haptic]);

  const onTouchEnd = useCallback(async () => {
    if (!isPulling) return;
    setIsPulling(false);
    
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      haptic.trigger('success');
      
      try {
        await onRefresh();
      } finally {
        // Add a small delay for visual feedback
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 300);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh, haptic]);

  return {
    pullDistance,
    isRefreshing,
    isPulling,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    },
    containerRef
  };
};
