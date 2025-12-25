import React from 'react';

// Golden shimmer skeleton component
const GoldenSkeleton = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={`rounded-md bg-primary/10 shimmer ${className}`} 
    {...props} 
  />
);

// Screen type to skeleton mapping
export type SkeletonType = 'consumer-home' | 'vendor-home' | 'messages' | 'profile' | 'list' | 'detail' | 'chat' | 'default';

/**
 * Get the appropriate skeleton component based on route/screen type
 */
export const getSkeletonForRoute = (path: string): React.ReactNode => {
  if (path === '/consumer' || path.startsWith('/consumer')) {
    return <ConsumerHomeSkeleton />;
  }
  if (path === '/vendor' || path.startsWith('/vendor')) {
    return <VendorHomeSkeleton />;
  }
  if (path === '/messages' || path.startsWith('/chat')) {
    return <MessagesSkeleton />;
  }
  if (path === '/profile' || path === '/rewards') {
    return <ProfileSkeleton />;
  }
  if (path === '/jobs' || path === '/notifications' || path === '/services') {
    return <ListSkeleton />;
  }
  if (path.startsWith('/job/') || path.startsWith('/request/') || path.startsWith('/quote-management/')) {
    return <DetailSkeleton />;
  }
  return <DefaultSkeleton />;
};

// Default loading skeleton
export const DefaultSkeleton = () => (
  <div className="flex flex-col h-screen bg-background items-center justify-center">
    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse">
      <div className="w-6 h-6 rounded-lg bg-primary/40" />
    </div>
  </div>
);

// List skeleton for jobs, notifications, services
export const ListSkeleton = () => (
  <div className="flex flex-col h-screen bg-background p-4 space-y-4">
    <div className="flex items-center gap-3 pt-12 pb-4">
      <GoldenSkeleton className="h-10 w-10 rounded-full" />
      <GoldenSkeleton className="h-6 w-32 rounded-lg" />
    </div>
    <GoldenSkeleton className="h-12 w-full rounded-2xl" />
    <div className="flex gap-2">
      {[1, 2, 3].map(i => (
        <GoldenSkeleton key={i} className="h-8 w-20 rounded-full" />
      ))}
    </div>
    <div className="space-y-3 flex-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
          <GoldenSkeleton className="h-14 w-14 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <GoldenSkeleton className="h-4 w-3/4 rounded-lg" />
            <GoldenSkeleton className="h-3 w-1/2 rounded-lg" />
          </div>
          <GoldenSkeleton className="h-4 w-12 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

// Detail skeleton for job details, request details
export const DetailSkeleton = () => (
  <div className="flex flex-col h-screen bg-background p-4 space-y-6">
    <div className="flex items-center gap-3 pt-12">
      <GoldenSkeleton className="h-10 w-10 rounded-full" />
      <GoldenSkeleton className="h-6 w-24 rounded-lg" />
    </div>
    <GoldenSkeleton className="h-48 w-full rounded-3xl" />
    <div className="space-y-3">
      <GoldenSkeleton className="h-7 w-3/4 rounded-lg" />
      <GoldenSkeleton className="h-4 w-full rounded-lg" />
      <GoldenSkeleton className="h-4 w-2/3 rounded-lg" />
    </div>
    <div className="flex gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex-1 p-4 rounded-2xl bg-card border border-border">
          <GoldenSkeleton className="h-6 w-12 rounded-lg mb-2" />
          <GoldenSkeleton className="h-3 w-16 rounded-lg" />
        </div>
      ))}
    </div>
    <div className="space-y-3">
      <GoldenSkeleton className="h-5 w-28 rounded-lg" />
      <GoldenSkeleton className="h-4 w-full rounded-lg" />
      <GoldenSkeleton className="h-4 w-full rounded-lg" />
      <GoldenSkeleton className="h-4 w-3/4 rounded-lg" />
    </div>
    <div className="mt-auto pb-6">
      <GoldenSkeleton className="h-14 w-full rounded-2xl" />
    </div>
  </div>
);

export const ConsumerHomeSkeleton = () => (
  <div className="flex flex-col h-screen bg-background">
    {/* Header Skeleton */}
    <div className="bg-card border-b border-border px-6 py-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <GoldenSkeleton className="w-10 h-10 rounded-2xl" />
          <div>
            <GoldenSkeleton className="h-7 w-32 mb-2 rounded-lg" />
            <GoldenSkeleton className="h-4 w-48 rounded-lg" />
          </div>
        </div>
        <GoldenSkeleton className="w-11 h-11 rounded-3xl" />
      </div>
      <GoldenSkeleton className="h-12 w-full rounded-xl" />
    </div>

    {/* Content Skeleton */}
    <div className="flex-1 overflow-hidden px-6 py-5 space-y-6">
      {/* Rewards Card Skeleton - Golden gradient background */}
      <div className="h-44 w-full rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/20 p-5 relative overflow-hidden pulse-glow">
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <GoldenSkeleton className="w-12 h-12 rounded-3xl" />
            <div>
              <GoldenSkeleton className="h-5 w-28 mb-2 rounded-lg" />
              <GoldenSkeleton className="h-4 w-20 rounded-lg" />
            </div>
          </div>
          <div className="text-right">
            <GoldenSkeleton className="h-7 w-16 mb-1 rounded-lg" />
            <GoldenSkeleton className="h-3 w-12 rounded-lg" />
          </div>
        </div>
        <GoldenSkeleton className="h-8 w-full rounded-2xl mb-3" />
        <GoldenSkeleton className="h-12 w-full rounded-2xl" />
      </div>

      {/* Quick Action Skeleton */}
      <div className="bg-card rounded-3xl p-5 border border-border shadow-sm">
        <GoldenSkeleton className="h-6 w-48 mb-2 rounded-lg" />
        <GoldenSkeleton className="h-4 w-56 mb-4 rounded-lg" />
        <GoldenSkeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* Quick Re-hire Skeleton */}
      <div>
        <div className="flex justify-between mb-4">
          <GoldenSkeleton className="h-5 w-28 rounded-lg" />
          <GoldenSkeleton className="h-4 w-16 rounded-lg" />
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-32 h-40 rounded-2xl flex-shrink-0 bg-card border border-border p-4 flex flex-col items-center">
              <GoldenSkeleton className="w-12 h-12 rounded-full mb-3" />
              <GoldenSkeleton className="h-4 w-20 mb-2 rounded-lg" />
              <GoldenSkeleton className="h-3 w-12 mb-3 rounded-lg" />
              <GoldenSkeleton className="h-8 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Categories Skeleton */}
      <div>
        <GoldenSkeleton className="h-5 w-36 mb-4 rounded-lg" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-card border border-border p-4 flex flex-col items-center justify-center">
              <GoldenSkeleton className="w-10 h-10 rounded-2xl mb-2" />
              <GoldenSkeleton className="h-3 w-14 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const VendorHomeSkeleton = () => (
  <div className="flex flex-col h-screen bg-background">
    {/* Header Skeleton - Golden gradient matching app design */}
    <div className="bg-gradient-golden px-6 py-5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary-foreground/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-primary-foreground/10 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 shimmer" />
            <div>
              <div className="h-7 w-44 mb-2 rounded-lg bg-primary-foreground/20 shimmer" />
              <div className="h-5 w-32 rounded-lg bg-primary-foreground/20 shimmer" />
            </div>
          </div>
          <div className="w-11 h-11 rounded-3xl bg-primary-foreground/20 shimmer" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-3xl bg-primary-foreground/20 border border-primary-foreground/10 shimmer p-3">
              <div className="w-8 h-8 mx-auto mb-1 rounded-xl bg-primary-foreground/20" />
              <div className="h-5 w-12 mx-auto mb-1 rounded-lg bg-primary-foreground/20" />
              <div className="h-3 w-14 mx-auto rounded-lg bg-primary-foreground/20" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="flex-1 overflow-hidden px-6 py-5 space-y-6">
      {/* Performance Cards */}
      <div>
        <GoldenSkeleton className="h-5 w-48 mb-3 rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-28 rounded-3xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 pulse-glow p-4">
            <div className="flex items-center gap-3 mb-2">
              <GoldenSkeleton className="w-10 h-10 rounded-xl" />
              <GoldenSkeleton className="h-3 w-16 rounded-lg" />
            </div>
            <GoldenSkeleton className="h-6 w-24 rounded-lg mb-1" />
            <GoldenSkeleton className="h-3 w-20 rounded-lg" />
          </div>
          <div className="h-28 rounded-3xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 pulse-glow p-4">
            <div className="flex items-center gap-3 mb-2">
              <GoldenSkeleton className="w-10 h-10 rounded-xl" />
              <GoldenSkeleton className="h-3 w-16 rounded-lg" />
            </div>
            <GoldenSkeleton className="h-6 w-24 rounded-lg mb-1" />
            <GoldenSkeleton className="h-3 w-20 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-card border border-border p-3 flex flex-col justify-center items-center">
            <GoldenSkeleton className="w-8 h-8 rounded-lg mb-2" />
            <GoldenSkeleton className="h-5 w-10 mb-1 rounded-lg" />
            <GoldenSkeleton className="h-3 w-14 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Weekly Trend */}
      <div className="h-28 rounded-3xl bg-card border border-border p-4">
        <GoldenSkeleton className="h-4 w-32 mb-3 rounded-lg" />
        <div className="flex gap-2 h-16 items-end">
          {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-lg bg-primary/20 shimmer" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      {/* Available Jobs */}
      <div>
        <div className="flex justify-between mb-4">
          <GoldenSkeleton className="h-5 w-32 rounded-lg" />
          <GoldenSkeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-card border border-border p-4">
              <div className="flex gap-3 mb-2">
                <GoldenSkeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex-1">
                  <GoldenSkeleton className="h-5 w-40 rounded-lg mb-2" />
                  <GoldenSkeleton className="h-3 w-24 rounded-lg" />
                </div>
              </div>
              <div className="flex gap-4">
                <GoldenSkeleton className="h-4 w-20 rounded-lg" />
                <GoldenSkeleton className="h-4 w-16 rounded-lg" />
                <GoldenSkeleton className="h-4 w-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const MessagesSkeleton = () => (
  <div className="flex flex-col h-screen bg-background">
    <div className="bg-card border-b border-border px-6 py-5">
      <GoldenSkeleton className="h-7 w-28 mb-4 rounded-lg" />
      <GoldenSkeleton className="h-10 w-full rounded-xl" />
    </div>
    <div className="flex-1 px-6 py-4 space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-3 p-3 bg-card rounded-2xl border border-border">
          <GoldenSkeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <GoldenSkeleton className="h-5 w-32 mb-2 rounded-lg" />
            <GoldenSkeleton className="h-4 w-full rounded-lg" />
          </div>
          <GoldenSkeleton className="h-4 w-12 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="flex flex-col h-screen bg-background">
    <div className="bg-foreground px-6 py-8">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full mb-4 bg-primary/30 shimmer" />
        <div className="h-6 w-36 mb-2 rounded-lg bg-primary/20 shimmer" />
        <div className="h-4 w-44 rounded-lg bg-primary/20 shimmer" />
      </div>
    </div>
    <div className="flex-1 px-6 py-5 space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-14 rounded-2xl bg-card border border-border p-4 flex items-center gap-3">
          <GoldenSkeleton className="w-6 h-6 rounded-lg" />
          <GoldenSkeleton className="h-4 flex-1 rounded-lg" />
          <GoldenSkeleton className="w-5 h-5 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);
