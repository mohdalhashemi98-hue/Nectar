import { memo } from 'react';

interface StackPatternProps {
  /** Opacity of the pattern (0-1 scale or tailwind value like "0.04") */
  opacity?: string;
  /** Custom className for positioning */
  className?: string;
  /** Color of the pattern in hex (without #) */
  color?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * StackPattern - Reusable decorative background pattern with stacked layers
 * Used throughout the app as the signature brand element
 */
const StackPattern = memo(({ 
  opacity = '0.04', 
  className = 'absolute inset-0',
  color = '3b82f6',
  size = 'md'
}: StackPatternProps) => {
  const dimensions = {
    sm: { width: 30, height: 36 },
    md: { width: 40, height: 48 },
    lg: { width: 56, height: 68 }
  };

  const { width, height } = dimensions[size];

  // SVG pattern that creates stacked 3D layers effect
  const svgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 40 48'%3E%3Cg fill='%23${color}' fill-rule='evenodd'%3E%3Cpath d='M20 4L4 14v8l16 10 16-10v-8L20 4zm0 4l12 7.5v5L20 28 8 20.5v-5L20 8z'/%3E%3Cpath d='M20 20L4 30v8l16 10 16-10v-8L20 20zm0 4l12 7.5v5L20 44 8 36.5v-5L20 24z' opacity='0.5'/%3E%3C/g%3E%3C/svg%3E")`;

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

/**
 * StackPatternCorner - Decorative corner pattern for cards
 */
export const StackPatternCorner = memo(({ 
  className = 'absolute top-0 right-0 w-32 h-32',
  opacity = '0.2'
}: { className?: string; opacity?: string }) => (
  <div className={`${className} opacity-${opacity.replace('0.', '')} pointer-events-none`}>
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
