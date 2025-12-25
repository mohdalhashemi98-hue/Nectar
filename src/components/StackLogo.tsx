import { cn } from "@/lib/utils";

interface StackLogoProps {
  className?: string;
  size?: number;
}

const StackLogo = ({ className, size = 64 }: StackLogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      {/* Three stacked bars forming an ascending graph */}
      <defs>
        <linearGradient id="bar1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
          <stop offset="100%" stopColor="hsl(199, 89%, 48%)" />
        </linearGradient>
        <linearGradient id="bar2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(199, 89%, 48%)" />
          <stop offset="100%" stopColor="hsl(187, 85%, 53%)" />
        </linearGradient>
        <linearGradient id="bar3Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(217, 91%, 55%)" />
          <stop offset="100%" stopColor="hsl(217, 91%, 65%)" />
        </linearGradient>
      </defs>
      
      {/* Left bar - shortest */}
      <rect
        x="8"
        y="32"
        width="14"
        height="24"
        rx="4"
        fill="url(#bar1Gradient)"
      />
      
      {/* Middle bar - tallest */}
      <rect
        x="25"
        y="12"
        width="14"
        height="44"
        rx="4"
        fill="url(#bar2Gradient)"
      />
      
      {/* Right bar - medium */}
      <rect
        x="42"
        y="22"
        width="14"
        height="34"
        rx="4"
        fill="url(#bar3Gradient)"
      />
    </svg>
  );
};

export default StackLogo;
