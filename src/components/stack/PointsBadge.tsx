import { Coins } from 'lucide-react';

interface PointsBadgeProps {
  points: number;
  size?: 'sm' | 'md';
}

const PointsBadge = ({ points, size = 'sm' }: PointsBadgeProps) => (
  <div 
    className={`points-badge ${size === 'sm' ? 'text-xs' : 'text-sm'}`}
    style={{ boxShadow: '0 0 12px hsl(38 92% 56% / 0.2)' }}
  >
    <Coins className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
    <span>+{points} pts</span>
  </div>
);

export default PointsBadge;
