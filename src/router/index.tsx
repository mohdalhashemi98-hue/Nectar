import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '@/components/shared/AppLayout';
import ScreenFallback from '@/components/stack/ScreenFallback';

// Lazy load all screens
const WelcomeScreen = lazy(() => import('@/features/screens/WelcomeScreen'));
const LoginScreen = lazy(() => import('@/features/screens/LoginScreen'));
const ConsumerHomeScreen = lazy(() => import('@/features/consumer/ConsumerHomeScreen'));
const VendorHomeScreen = lazy(() => import('@/features/vendor/VendorHomeScreen'));
const VendorScheduleScreen = lazy(() => import('@/features/vendor/VendorScheduleScreen'));
const VendorProfileScreen = lazy(() => import('@/features/vendor/VendorProfileScreen'));
const ProfileScreen = lazy(() => import('@/features/screens/ProfileScreen'));
const RewardsScreen = lazy(() => import('@/features/screens/RewardsScreen'));
const NotificationsScreen = lazy(() => import('@/features/screens/NotificationsScreen'));
const MessagesScreen = lazy(() => import('@/features/screens/MessagesScreen'));
const ChatScreen = lazy(() => import('@/features/screens/ChatScreen'));
const JobsScreen = lazy(() => import('@/features/screens/JobsScreen'));
const JobDetailScreen = lazy(() => import('@/features/screens/JobDetailScreen'));
const PostJobScreen = lazy(() => import('@/features/consumer/PostJobScreen'));
const JobConfigurationScreen = lazy(() => import('@/features/consumer/JobConfigurationScreen'));
const QuoteManagementScreen = lazy(() => import('@/features/consumer/QuoteManagementScreen'));
const ReviewScreen = lazy(() => import('@/features/screens/ReviewScreen'));
const PaymentScreen = lazy(() => import('@/features/screens/PaymentScreen'));
const RequestDetailScreen = lazy(() => import('@/features/vendor/RequestDetailScreen'));
const ServicesScreen = lazy(() => import('@/features/screens/ServicesScreen'));
const MarketBenchmarkScreen = lazy(() => import('@/features/screens/MarketBenchmarkScreen'));
const CompanyProfileScreen = lazy(() => import('@/features/screens/CompanyProfileScreen'));
const HelpScreen = lazy(() => import('@/features/screens/HelpScreen'));
const TransactionsScreen = lazy(() => import('@/features/screens/TransactionsScreen'));
const VendorWorkScreen = lazy(() => import('@/features/vendor/VendorWorkScreen'));

// Wrapper to add suspense to lazy components
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<ScreenFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: withSuspense(WelcomeScreen) },
      { path: 'login', element: withSuspense(LoginScreen) },
      { path: 'consumer', element: withSuspense(ConsumerHomeScreen) },
      { path: 'vendor', element: withSuspense(VendorHomeScreen) },
      { path: 'vendor/schedule', element: withSuspense(VendorScheduleScreen) },
      { path: 'vendor/profile-preview', element: withSuspense(VendorProfileScreen) },
      { path: 'vendor/profile/:id', element: withSuspense(VendorProfileScreen) },
      { path: 'profile', element: withSuspense(ProfileScreen) },
      { path: 'rewards', element: withSuspense(RewardsScreen) },
      { path: 'notifications', element: withSuspense(NotificationsScreen) },
      { path: 'messages', element: withSuspense(MessagesScreen) },
      { path: 'chat', element: withSuspense(ChatScreen) },
      { path: 'chat/:id', element: withSuspense(ChatScreen) },
      { path: 'jobs', element: withSuspense(JobsScreen) },
      { path: 'job/:id', element: withSuspense(JobDetailScreen) },
      { path: 'job', element: withSuspense(JobDetailScreen) },
      { path: 'post-request', element: withSuspense(PostJobScreen) },
      { path: 'job-configuration', element: withSuspense(JobConfigurationScreen) },
      { path: 'quote-management', element: withSuspense(QuoteManagementScreen) },
      { path: 'quote-management/:id', element: withSuspense(QuoteManagementScreen) },
      { path: 'review', element: withSuspense(ReviewScreen) },
      { path: 'review/:id', element: withSuspense(ReviewScreen) },
      { path: 'payment', element: withSuspense(PaymentScreen) },
      { path: 'payment/:id', element: withSuspense(PaymentScreen) },
      { path: 'request/:id', element: withSuspense(RequestDetailScreen) },
      { path: 'request', element: withSuspense(RequestDetailScreen) },
      { path: 'services', element: withSuspense(ServicesScreen) },
      { path: 'market-benchmark', element: withSuspense(MarketBenchmarkScreen) },
      { path: 'company-profile', element: withSuspense(CompanyProfileScreen) },
      { path: 'help', element: withSuspense(HelpScreen) },
      { path: 'transactions', element: withSuspense(TransactionsScreen) },
      { path: 'vendor-work', element: withSuspense(VendorWorkScreen) },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router;
