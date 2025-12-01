import { 
  Sparkles, Wrench, Package, Scissors, Monitor, Truck, 
  Wind, Droplets, Zap, Paintbrush, LucideIcon 
} from 'lucide-react';

export const categoryIconMap: Record<string, LucideIcon> = {
  'Cleaning': Sparkles,
  'Maintenance': Wrench,
  'Materials': Package,
  'Beauty': Scissors,
  'Tech': Monitor,
  'Moving': Truck,
  'AC & HVAC': Wind,
  'Plumbing': Droplets,
  'Electrical': Zap,
  'Painting': Paintbrush,
};

export const getCategoryIcon = (category: string): LucideIcon => {
  return categoryIconMap[category] || Package;
};

// Category Icon Component for easy rendering
interface CategoryIconProps {
  category: string;
  className?: string;
}

export const CategoryIcon = ({ category, className = "w-5 h-5" }: CategoryIconProps) => {
  const Icon = getCategoryIcon(category);
  return <Icon className={className} />;
};