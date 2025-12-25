import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HapticButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  hapticIntensity?: 'light' | 'medium' | 'strong';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const HapticButton: React.FC<HapticButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  hapticIntensity = 'medium',
  disabled,
  type = 'button',
  onClick,
}) => {
  // Scale values based on haptic intensity
  const scaleValues = {
    light: 0.98,
    medium: 0.96,
    strong: 0.94,
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger haptic feedback on supported devices
    if ('vibrate' in navigator) {
      const vibrationDuration = {
        light: 10,
        medium: 20,
        strong: 30,
      };
      navigator.vibrate(vibrationDuration[hapticIntensity]);
    }
    
    onClick?.(e);
  };

  const baseStyles = cn(
    "relative inline-flex items-center justify-center font-medium rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
      // Variants
      'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
      'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
      'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
      // Sizes
      'h-9 px-4 text-sm': size === 'sm',
      'h-11 px-6 text-base': size === 'md',
      'h-14 px-8 text-lg': size === 'lg',
    },
    className
  );

  return (
    <motion.button
      className={baseStyles}
      onClick={handleClick}
      disabled={disabled}
      type={type}
      whileTap={{ scale: disabled ? 1 : scaleValues[hapticIntensity] }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
};

export default HapticButton;
