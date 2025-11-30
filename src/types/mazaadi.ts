// Mazaadi App Types

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  location: string;
  memberSince: string;
}

export interface Rewards {
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  tierProgress: number;
  pointsToNextTier: number;
  nextTier: string;
  cashbackRate: number;
  streak: number;
  totalSaved: number;
  lifetimePoints: number;
  weeklyChallenge: {
    title: string;
    progress: number;
    target: number;
    reward: number;
    endsIn: string;
  };
  achievements: Achievement[];
  recentEarnings: Earning[];
}

export interface Achievement {
  id: number;
  name: string;
  icon: string;
  earned: boolean;
  date: string | null;
}

export interface Earning {
  description: string;
  points: number;
  date: string;
  type: string;
}

export interface Category {
  name: string;
  icon: string;
  gradient: string;
  jobs: number;
  avgPrice: string;
  description: string;
}

export interface Job {
  id: number;
  title: string;
  vendor: string | null;
  vendorId: number | null;
  amount: number;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Awaiting Completion' | 'Cancelled';
  paymentStatus: 'Paid' | 'Escrow' | null;
  pointsEarned: number;
  date: string;
  completedDate: string | null;
  rated: boolean;
  rating: number;
  category: string;
  offersCount?: number;
}

export interface Offer {
  id: number;
  vendor: string;
  vendorId: number;
  rating: number;
  reviews: number;
  price: number;
  responseTime: string;
  verified: boolean;
  distance: string;
  description: string;
  completionRate: number;
  matchScore: number;
  availability: string;
  message: string;
}

export interface Vendor {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  avatar: string;
  specialty: string;
  verified: boolean;
  favorite: boolean;
  lastJob: string;
  completedJobs: number;
  lastJobDate: string;
  responseTime: string;
  distance: string;
  avgPrice: string;
  completionRate: number;
  phone: string;
}

export interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  online: boolean;
  messages: Message[];
}

export interface Message {
  id: number;
  sender: 'user' | 'vendor';
  text: string;
  time: string;
}

export interface Notification {
  id: number;
  icon: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: string;
}

export interface AvailableJob {
  id: number;
  title: string;
  budget: string;
  distance: string;
  time: string;
  urgent: boolean;
  category: string;
  description: string;
  client: {
    name: string;
    member: string;
  };
}

export interface VendorStats {
  totalJobs: number;
  totalEarnings: number;
  rating: number;
  reviews: number;
  completionRate: number;
  responseTime: string;
  thisMonth: {
    jobs: number;
    earnings: number;
  };
}

export interface RequestDetails {
  title: string;
  description: string;
  category: string;
  budget: string;
  urgency: 'flexible' | 'today' | 'urgent';
  photos: string[];
}

export interface ReviewData {
  rating: number;
  comment: string;
  tags: string[];
}

export interface TierConfig {
  [key: string]: {
    color: string;
    cashback: number;
    minPoints: number;
    icon: string;
    benefits: string[];
  };
}

export type UserType = 'consumer' | 'vendor' | null;
export type ScreenType = 
  | 'welcome'
  | 'consumer-home'
  | 'vendor-home'
  | 'post-request'
  | 'view-offers'
  | 'payment'
  | 'job-detail'
  | 'transactions'
  | 'rewards'
  | 'messages-list'
  | 'chat'
  | 'vendor-profile'
  | 'previous-vendors'
  | 'quick-rehire'
  | 'request-detail'
  | 'notifications'
  | 'profile';
