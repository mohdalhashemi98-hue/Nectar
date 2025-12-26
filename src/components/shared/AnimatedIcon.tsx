import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { haptic } from '@/hooks/use-haptic';

interface AnimatedIconProps {
  icon?: LucideIcon;
  children?: ReactNode;
  size?: number;
  className?: string;
  onClick?: () => void;
  hapticEnabled?: boolean;
}

/**
 * AnimatedIcon - Wraps icons with a subtle tap animation and haptic feedback
 * Can accept either a Lucide icon component or children
 */
const AnimatedIcon = ({
  icon: Icon,
  children,
  size = 24,
  className = '',
  onClick,
  hapticEnabled = true
}: AnimatedIconProps) => {
  const handleClick = () => {
    if (hapticEnabled) {
      haptic('light');
    }
    onClick?.();
  };

  return (
    <motion.div
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.05 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 17 
      }}
      onClick={handleClick}
      className={`inline-flex items-center justify-center cursor-pointer ${className}`}
    >
      {Icon ? <Icon size={size} /> : children}
    </motion.div>
  );
};

export default AnimatedIcon;
