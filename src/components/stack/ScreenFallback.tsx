import { motion } from 'framer-motion';

/**
 * Minimal loading fallback for Suspense during screen transitions
 * Designed to be fast and unobtrusive
 */
const ScreenFallback = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col h-screen bg-background items-center justify-center"
  >
    <motion.div
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{ 
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center"
    >
      <div className="w-6 h-6 rounded-lg bg-primary/40" />
    </motion.div>
  </motion.div>
);

export default ScreenFallback;
