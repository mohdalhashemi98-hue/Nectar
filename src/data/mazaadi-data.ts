import { Category, Job, Offer, Vendor, Conversation, Notification, AvailableJob, Rewards, VendorStats, TierConfig, UserProfile } from '@/types/mazaadi';

export const tierConfig: TierConfig = {
  Bronze: { color: 'amber', cashback: 2, minPoints: 0, icon: '🥉', benefits: ['2% cashback', 'Basic support'] },
  Silver: { color: 'gray', cashback: 5, minPoints: 1000, icon: '🥈', benefits: ['5% cashback', 'Priority support', 'Free cancellation'] },
  Gold: { color: 'yellow', cashback: 8, minPoints: 2500, icon: '🥇', benefits: ['8% cashback', 'VIP support', 'Free cancellation', 'Exclusive offers'] },
  Platinum: { color: 'purple', cashback: 12, minPoints: 5000, icon: '👑', benefits: ['12% cashback', 'Dedicated support', 'Free cancellation', 'Exclusive offers', 'Early access'] }
};

export const initialUserProfile: UserProfile = {
  name: 'Mohammed Ahmed',
  phone: '+971 50 123 4567',
  email: 'mohammed@example.com',
  avatar: 'M',
  location: 'Dubai Marina',
  memberSince: '2024'
};

export const initialRewards: Rewards = {
  points: 2847,
  tier: 'Gold',
  tierProgress: 72,
  pointsToNextTier: 1153,
  nextTier: 'Platinum',
  cashbackRate: 8,
  streak: 5,
  totalSaved: 847,
  lifetimePoints: 4520,
  weeklyChallenge: {
    title: 'Complete 3 Platform Payments',
    progress: 2,
    target: 3,
    reward: 150,
    endsIn: '3 days'
  },
  achievements: [
    { id: 1, name: 'First Booking', icon: 'Trophy', earned: true, date: 'Jan 2024' },
    { id: 2, name: 'Loyal Customer', icon: 'Gem', earned: true, date: 'Feb 2024' },
    { id: 3, name: 'Quick Payer', icon: 'Zap', earned: true, date: 'Feb 2024' },
    { id: 4, name: 'Review Master', icon: 'Star', earned: false, date: null, progress: 7, target: 10 },
    { id: 5, name: 'Super Saver', icon: 'PiggyBank', earned: false, date: null, progress: 650, target: 1000 },
    { id: 6, name: 'VIP Member', icon: 'Crown', earned: false, date: null, progress: 2847, target: 5000 }
  ],
  recentEarnings: [
    { description: 'AC Maintenance', points: 125, date: '2 days ago', type: 'job' },
    { description: 'Weekly Streak Bonus', points: 50, date: '3 days ago', type: 'bonus' },
    { description: 'Plumbing Repair', points: 90, date: '1 week ago', type: 'job' },
    { description: 'Review Bonus', points: 25, date: '1 week ago', type: 'bonus' }
  ]
};

export const categories: Category[] = [
  { name: 'Cleaning', icon: 'Sparkles', gradient: 'from-blue-500 to-cyan-400', jobs: 1247, avgPrice: '150 AED', description: 'Home & office cleaning' },
  { name: 'Maintenance', icon: 'Wrench', gradient: 'from-orange-500 to-red-400', jobs: 892, avgPrice: '280 AED', description: 'Repairs & fixes' },
  { name: 'Materials', icon: 'Package', gradient: 'from-purple-500 to-pink-400', jobs: 634, avgPrice: '320 AED', description: 'Supplies & materials' },
  { name: 'Beauty', icon: 'Scissors', gradient: 'from-pink-500 to-rose-400', jobs: 567, avgPrice: '200 AED', description: 'Personal care services' },
  { name: 'Tech', icon: 'Monitor', gradient: 'from-indigo-500 to-blue-400', jobs: 423, avgPrice: '350 AED', description: 'Tech support & repair' },
  { name: 'Moving', icon: 'Truck', gradient: 'from-green-500 to-emerald-400', jobs: 389, avgPrice: '400 AED', description: 'Relocation services' },
  { name: 'AC & HVAC', icon: 'Wind', gradient: 'from-cyan-500 to-blue-400', jobs: 756, avgPrice: '250 AED', description: 'Cooling & ventilation' },
  { name: 'Plumbing', icon: 'Droplets', gradient: 'from-blue-500 to-indigo-400', jobs: 543, avgPrice: '200 AED', description: 'Water & pipes' },
  { name: 'Electrical', icon: 'Zap', gradient: 'from-yellow-500 to-orange-400', jobs: 421, avgPrice: '220 AED', description: 'Electrical work' }
];

export const initialJobs: Job[] = [
  { 
    id: 1, 
    title: 'AC Maintenance', 
    vendor: 'Ahmad Al-Mansouri',
    vendorId: 1,
    amount: 250, 
    status: 'Completed',
    paymentStatus: 'Paid',
    pointsEarned: 125,
    date: '2024-02-15',
    completedDate: '2024-02-15',
    rated: true,
    rating: 5,
    category: 'AC & HVAC'
  },
  { 
    id: 5, 
    title: 'Kitchen Plumbing Fix', 
    vendor: 'Sarah Hassan',
    vendorId: 2,
    amount: 180, 
    status: 'Completed',
    paymentStatus: 'Paid',
    pointsEarned: 0,
    date: '2024-02-25',
    completedDate: '2024-02-26',
    rated: false,
    rating: 0,
    category: 'Plumbing'
  },
  { 
    id: 2, 
    title: 'Plumbing Repair', 
    vendor: 'Sarah Hassan',
    vendorId: 2,
    amount: 180, 
    status: 'In Progress',
    paymentStatus: 'Escrow',
    pointsEarned: 0,
    date: '2024-02-20',
    completedDate: null,
    rated: false,
    rating: 0,
    category: 'Plumbing'
  },
  { 
    id: 3, 
    title: 'Painting Service', 
    vendor: null,
    vendorId: null,
    amount: 0, 
    status: 'Pending',
    paymentStatus: null,
    pointsEarned: 0,
    date: '2024-02-22',
    completedDate: null,
    rated: false,
    rating: 0,
    category: 'Maintenance',
    offersCount: 3
  },
  { 
    id: 4, 
    title: 'Deep Cleaning', 
    vendor: 'CleanPro Services',
    vendorId: 4,
    amount: 350, 
    status: 'Awaiting Completion',
    paymentStatus: 'Escrow',
    pointsEarned: 0,
    date: '2024-02-21',
    completedDate: null,
    rated: false,
    rating: 0,
    category: 'Cleaning'
  }
];

export const initialOffers: Offer[] = [
  {
    id: 1,
    vendor: 'Ahmad Al-Mansouri',
    vendorId: 1,
    rating: 4.9,
    reviews: 247,
    price: 250,
    responseTime: 'Instant',
    verified: true,
    distance: '2.3 km',
    description: 'Expert AC specialist • Same-day service • 5+ years',
    completionRate: 98,
    matchScore: 95,
    availability: 'Available Now',
    message: 'I can help with your AC maintenance. I have extensive experience with all major brands.'
  },
  {
    id: 2,
    vendor: 'HomeServ Pro',
    vendorId: 5,
    rating: 4.7,
    reviews: 189,
    price: 220,
    responseTime: '5 min',
    verified: true,
    distance: '3.1 km',
    description: 'Licensed professionals • Free inspection',
    completionRate: 96,
    matchScore: 88,
    availability: 'Today 2PM',
    message: 'We offer competitive rates and guarantee our work. Free inspection included.'
  },
  {
    id: 3,
    vendor: 'Quick Fix UAE',
    vendorId: 6,
    rating: 4.5,
    reviews: 124,
    price: 280,
    responseTime: '15 min',
    verified: true,
    distance: '4.5 km',
    description: 'Premium service • Warranty included',
    completionRate: 94,
    matchScore: 82,
    availability: 'Tomorrow 10AM',
    message: 'Premium service with 6-month warranty on all work.'
  }
];

export const initialVendors: Vendor[] = [
  {
    id: 1,
    name: 'Ahmad Al-Mansouri',
    rating: 4.9,
    reviews: 247,
    avatar: 'A',
    specialty: 'AC & HVAC',
    verified: true,
    favorite: true,
    lastJob: 'AC Maintenance',
    completedJobs: 3,
    lastJobDate: '2 weeks ago',
    responseTime: 'Instant',
    distance: '2.3 km',
    avgPrice: '250 AED',
    completionRate: 98,
    phone: '+971 50 111 2222'
  },
  {
    id: 2,
    name: 'Sarah Hassan',
    rating: 4.8,
    reviews: 189,
    avatar: 'S',
    specialty: 'Plumbing',
    verified: true,
    favorite: false,
    lastJob: 'Pipe Repair',
    completedJobs: 2,
    lastJobDate: '1 month ago',
    responseTime: '5 min',
    distance: '3.5 km',
    avgPrice: '180 AED',
    completionRate: 96,
    phone: '+971 50 222 3333'
  },
  {
    id: 3,
    name: 'Ali Painting Services',
    rating: 4.7,
    reviews: 156,
    avatar: 'A',
    specialty: 'Painting',
    verified: true,
    favorite: true,
    lastJob: 'Room Painting',
    completedJobs: 1,
    lastJobDate: '3 months ago',
    responseTime: '10 min',
    distance: '5.2 km',
    avgPrice: '320 AED',
    completionRate: 95,
    phone: '+971 50 333 4444'
  },
  {
    id: 4,
    name: 'CleanPro Services',
    rating: 4.6,
    reviews: 98,
    avatar: 'C',
    specialty: 'Cleaning',
    verified: true,
    favorite: false,
    lastJob: 'Deep Cleaning',
    completedJobs: 1,
    lastJobDate: '1 week ago',
    responseTime: '20 min',
    distance: '6.1 km',
    avgPrice: '350 AED',
    completionRate: 92,
    phone: '+971 50 444 5555'
  }
];

export const initialConversations: Conversation[] = [
  { 
    id: 1, 
    name: 'Ahmad Al-Mansouri', 
    avatar: 'A',
    lastMessage: 'On my way! Will be there in 15 minutes.', 
    time: '2m', 
    unread: true,
    online: true,
    messages: [
      { id: 1, sender: 'vendor', text: 'Hello! I can help with your AC maintenance.', time: '10:30 AM' },
      { id: 2, sender: 'user', text: 'Great! When can you start?', time: '10:31 AM' },
      { id: 3, sender: 'vendor', text: 'I can come today afternoon. Would 2PM work?', time: '10:32 AM' },
      { id: 4, sender: 'user', text: 'Perfect, see you then!', time: '10:33 AM' },
      { id: 5, sender: 'vendor', text: 'On my way! Will be there in 15 minutes.', time: '1:45 PM' }
    ]
  },
  { 
    id: 2, 
    name: 'Sarah Hassan', 
    avatar: 'S',
    lastMessage: 'Thank you for choosing our service!', 
    time: '1h', 
    unread: false,
    online: false,
    messages: [
      { id: 1, sender: 'vendor', text: 'Hi! I saw your plumbing request.', time: '9:00 AM' },
      { id: 2, sender: 'user', text: 'Yes, I have a leak under the sink.', time: '9:05 AM' },
      { id: 3, sender: 'vendor', text: 'I can fix that. My rate is 180 AED.', time: '9:06 AM' },
      { id: 4, sender: 'vendor', text: 'Thank you for choosing our service!', time: '11:00 AM' }
    ]
  },
  { 
    id: 3, 
    name: 'HomeServ Pro', 
    avatar: 'H',
    lastMessage: 'When would you like us to visit?', 
    time: '3h', 
    unread: false,
    online: true,
    messages: [
      { id: 1, sender: 'vendor', text: 'Hello! We received your service request.', time: '8:00 AM' },
      { id: 2, sender: 'vendor', text: 'When would you like us to visit?', time: '8:01 AM' }
    ]
  }
];

export const initialNotifications: Notification[] = [
  { id: 1, icon: '💼', title: 'New offer received', message: 'Ahmad Al-Mansouri sent an offer for AC Maintenance', time: '5 min ago', unread: true, type: 'offer' },
  { id: 2, icon: '🎁', title: 'Rewards update', message: 'You earned 125 points from your last booking!', time: '30 min ago', unread: true, type: 'reward' },
  { id: 3, icon: '💬', title: 'New message', message: 'Sarah Hassan: "Thank you for choosing our service!"', time: '1 hour ago', unread: true, type: 'message' },
  { id: 4, icon: '🔥', title: 'Streak bonus!', message: 'Your 5-day streak is active. 2x points on next booking!', time: '1 hour ago', unread: false, type: 'reward' },
  { id: 5, icon: '✅', title: 'Job completed', message: 'Your AC Maintenance job has been marked complete', time: '2 hours ago', unread: false, type: 'job' },
  { id: 6, icon: '💳', title: 'Payment processed', message: 'Payment of 250 AED processed successfully', time: '2 hours ago', unread: false, type: 'payment' }
];

export const initialAvailableJobs: AvailableJob[] = [
  { id: 101, title: 'AC Maintenance Required', budget: '200-300 AED', distance: '2.3 km', time: '15 min ago', urgent: true, category: 'AC & HVAC', description: 'Need AC maintenance for 2 units in villa.', client: { name: 'Mohammed K.', member: '2024' } },
  { id: 102, title: 'Electrical Wiring Check', budget: '150-250 AED', distance: '4.1 km', time: '1 hour ago', urgent: false, category: 'Electrical', description: 'Check and fix some electrical outlets.', client: { name: 'Ali R.', member: '2023' } },
  { id: 103, title: 'AC Installation', budget: '400-600 AED', distance: '5.2 km', time: '2 hours ago', urgent: false, category: 'AC & HVAC', description: 'Install new split AC unit in bedroom.', client: { name: 'Sara M.', member: '2024' } }
];

export const initialVendorStats: VendorStats = {
  totalJobs: 127,
  totalEarnings: 15420,
  rating: 4.9,
  reviews: 247,
  completionRate: 98,
  responseTime: 'Instant',
  thisMonth: { jobs: 12, earnings: 3200 }
};
