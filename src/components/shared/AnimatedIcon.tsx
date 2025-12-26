import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface AnimatedIconProps {
  icon?: LucideIcon;
  children?: ReactNode;
  size?: number;
  className?: string;
  onClick?: () => void;
}

/**
 * AnimatedIcon - Wraps icons with a subtle tap animation
 * Can accept either a Lucide icon component or children
 */
const AnimatedIcon = ({
  icon: Icon,
  children,
  size = 24,
  className = '',
  onClick
}: AnimatedIconProps) => {
  return (
    <motion.div
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.05 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 17 
      }}
      onClick={onClick}
      className={`inline-flex items-center justify-center cursor-pointer ${className}`}
    >
      {Icon ? <Icon size={size} /> : children}
    </motion.div>
  );
};

export default AnimatedIcon;
