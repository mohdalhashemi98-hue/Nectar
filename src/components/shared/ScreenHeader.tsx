import { motion } from 'framer-motion';
import { ChevronLeft, LucideIcon } from 'lucide-react';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  icon?: LucideIcon;
  rightAction?: React.ReactNode;
  gradient?: boolean;
  children?: React.ReactNode;
}

const ScreenHeader = ({
  title,
  subtitle,
  onBack,
  icon: Icon,
  rightAction,
  gradient = false,
  children,
}: ScreenHeaderProps) => {
  return (
    <div className="px-4 py-5 bg-background border-b border-border">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        {onBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        )}

        <div className="flex-1 min-w-0">
          <h1 className="font-display text-xl font-bold text-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary">
            <Icon className="w-5 h-5 text-foreground" />
          </div>
        )}

        {rightAction}
      </motion.div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default ScreenHeader;
