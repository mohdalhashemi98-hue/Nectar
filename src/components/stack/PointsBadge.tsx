import { Coins } from 'lucide-react';

interface PointsBadgeProps {
  points: number;
  size?: 'sm' | 'md';
}

const PointsBadge = ({ points, size = 'sm' }: PointsBadgeProps) => (
  <div className={`points-badge ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
    <Coins className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
    <span>+{points} pts</span>
  </div>
);

export default PointsBadge;
