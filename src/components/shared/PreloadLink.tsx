import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useContextualPreload } from '@/hooks/use-contextual-preload';
import { ScreenType } from '@/types/stack';

interface PreloadLinkProps {
  to: ScreenType;
  children: React.ReactNode;
  className?: string;
  haptic?: boolean;
  onClick?: () => void;
}

export const PreloadLink: React.FC<PreloadLinkProps> = ({
  to,
  children,
  className,
  haptic = true,
  onClick,
}) => {
  const { navigateTo } = useAppNavigation();
  const { getPreloadProps } = useContextualPreload();

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    // Trigger haptic feedback on supported devices
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    onClick?.();
    navigateTo(to);
  };

  const preloadProps = getPreloadProps(to);

  if (haptic) {
    return (
      <motion.div
        className={cn('cursor-pointer', className)}
        onClick={handleClick}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...preloadProps}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn('cursor-pointer', className)}
      onClick={handleClick}
      {...preloadProps}
    >
      {children}
    </div>
  );
};

export default PreloadLink;