import { memo, useEffect, useState } from 'react';

interface StackPatternProps {
  /** Opacity of the pattern (0-1 scale) */
  opacity?: string;
  /** Custom className for positioning */
  className?: string;
  /** Color of the pattern in hex (without #). If 'auto', uses theme-aware colors */
  color?: string | 'auto';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Force a specific theme color instead of auto-detection */
  forceTheme?: 'light' | 'dark';
}

// Theme-aware colors
const THEME_COLORS = {
  light: '3b82f6', // Blue for light mode
  dark: '93c5fd'   // Lighter blue for dark mode
};

/**
 * StackPattern - Reusable decorative background pattern with stacked layers
 * Used throughout the app as the signature brand element
 * 
 * Now with automatic dark mode support - uses lighter colors in dark mode
 * for better visibility
 */
const StackPattern = memo(({ 
  opacity = '0.04', 
  className = 'absolute inset-0',
  color = 'auto',
  size = 'md',
  forceTheme
}: StackPatternProps) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setCurrentTheme(isDark ? 'dark' : 'light');
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const dimensions = {
    sm: { width: 30, height: 36 },
    md: { width: 40, height: 48 },
    lg: { width: 56, height: 68 }
  };

  const { width, height } = dimensions[size];

  // Determine the color to use
  const effectiveTheme = forceTheme || currentTheme;
  const patternColor = color === 'auto' 
    ? THEME_COLORS[effectiveTheme] 
    : color;

  // SVG pattern that creates stacked 3D layers effect
  const svgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 40 48'%3E%3Cg fill='%23${patternColor}' fill-rule='evenodd'%3E%3Cpath d='M20 4L4 14v8l16 10 16-10v-8L20 4zm0 4l12 7.5v5L20 28 8 20.5v-5L20 8z'/%3E%3Cpath d='M20 20L4 30v8l16 10 16-10v-8L20 20zm0 4l12 7.5v5L20 44 8 36.5v-5L20 24z' opacity='0.5'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div 
      className={`pointer-events-none ${className}`}
      style={{
        opacity: parseFloat(opacity),
        backgroundImage: svgPattern,
        backgroundRepeat: 'repeat'
      }}
    />
  );
});

StackPattern.displayName = 'StackPattern';

interface StackPatternCornerProps {
  className?: string;
  opacity?: string;
  /** If true, uses theme-aware colors */
  themeAware?: boolean;
}

/**
 * StackPatternCorner - Decorative corner pattern for cards
 * Now with dark mode support via CSS currentColor
 */
export const StackPatternCorner = memo(({ 
  className = 'absolute top-0 right-0 w-32 h-32',
  opacity = '0.2',
  themeAware = true
}: StackPatternCornerProps) => (
  <div 
    className={`${className} pointer-events-none ${themeAware ? 'text-primary dark:text-primary/80' : ''}`}
    style={{ opacity: parseFloat(opacity) }}
  >
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <pattern id="stackPatternCorner" width="25" height="30" patternUnits="userSpaceOnUse">
          <path 
            d="M12.5 2L2 8v4l10.5 6.5L23 12V8L12.5 2zm0 2.5l8 5v2l-8 5-8-5v-2l8-5z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.8"
          />
          <path 
            d="M12.5 14L2 20v4l10.5 6.5L23 24v-4L12.5 14zm0 2.5l8 5v2l-8 5-8-5v-2l8-5z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.8" 
            opacity="0.6"
          />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#stackPatternCorner)"/>
    </svg>
  </div>
));

StackPatternCorner.displayName = 'StackPatternCorner';

export default StackPattern;
