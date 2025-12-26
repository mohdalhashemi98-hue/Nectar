import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { ScreenType, UserType } from '@/types/stack';

interface ScreenWrapperProps {
  children: ReactNode;
  /** Whether to show the bottom navigation */
  showNav?: boolean;
  /** User type for bottom nav */
  userType?: UserType;
  /** Active nav item key */
  activeNav?: string;
  /** Navigation handler for bottom nav */
  onNavigate?: (screen: ScreenType) => void;
  /** Whether to apply safe area padding at top */
  safeAreaTop?: boolean;
  /** Whether this is a full-bleed screen (no horizontal padding) */
  fullBleed?: boolean;
  /** Custom className for the content wrapper */
  className?: string;
  /** Pending quotes count for nav badge */
  pendingQuotes?: number;
  /** Unread messages count for nav badge */
  unreadMessages?: number;
}

/**
 * ScreenWrapper - Unified layout component for consistent screen sizing
 * 
 * Enforces:
 * - Max width constraint (max-w-md / 448px) for mobile-first design
 * - Consistent horizontal padding (px-4 = 16px)
 * - Safe area handling for iOS/Android notches and home indicators
 * - Centered content on larger screens
 * - Proper bottom padding when nav is shown
 */
const ScreenWrapper = ({
  children,
  showNav = false,
  userType = null,
  activeNav = 'home',
  onNavigate,
  safeAreaTop = false,
  fullBleed = false,
  className = '',
  pendingQuotes = 0,
  unreadMessages = 2
}: ScreenWrapperProps) => {
  return (
    <div className="screen-container w-full">
      {/* Main content area */}
      <div 
        className={`
          screen-content w-full
          ${safeAreaTop ? 'safe-area-pt' : ''}
          ${showNav ? 'has-bottom-nav' : ''}
          ${fullBleed ? '' : 'screen-padded'}
          ${className}
        `}
      >
        {children}
      </div>

      {/* Bottom Navigation */}
      {showNav && userType && onNavigate && (
        <BottomNav
          active={activeNav}
          userType={userType}
          onNavigate={onNavigate}
          pendingQuotes={pendingQuotes}
          unreadMessages={unreadMessages}
        />
      )}
    </div>
  );
};

export default ScreenWrapper;
