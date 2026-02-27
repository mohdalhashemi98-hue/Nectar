import { motion } from 'framer-motion';
import { ChevronLeft, LucideIcon } from 'lucide-react';
import StackPattern from '@/components/stack/StackPattern';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  icon?: LucideIcon;
  rightAction?: React.ReactNode;
  /** Use gradient styling (default: true) */
  gradient?: boolean;
  /** Additional content below title (e.g., search bar) */
  children?: React.ReactNode;
}

/**
 * Unified header component for secondary screens.
 * Provides consistent back button, title, and optional actions.
 */
const ScreenHeader = ({
  title,
  subtitle,
  onBack,
  icon: Icon,
  rightAction,
  gradient = true,
  children,
}: ScreenHeaderProps) => {
  return (
    <div
      className={`px-4 py-6 relative overflow-hidden ${
        gradient
          ? 'bg-[#0f172a] text-white'
          : 'bg-card text-foreground border-b border-border'
      }`}
    >
      {gradient && (
        <>
          <StackPattern opacity="0.04" color="ffffff" className="absolute inset-0" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber/10 rounded-full blur-3xl" />
        </>
      )}

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          {onBack && (
            <button
              onClick={onBack}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                gradient
                  ? 'bg-white/10 hover:bg-white/15'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl font-bold truncate">{title}</h1>
            {subtitle && (
              <p className={`text-sm mt-0.5 ${gradient ? 'text-slate-400' : 'text-muted-foreground'}`}>
                {subtitle}
              </p>
            )}
          </div>

          {Icon && (
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                gradient ? 'bg-amber/20' : 'bg-secondary'
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>
          )}

          {rightAction}
        </motion.div>

        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};

export default ScreenHeader;
