import { Skeleton } from '@/components/ui/skeleton';

export const ConsumerHomeSkeleton = () => (
  <div className="flex flex-col h-screen bg-background">
    {/* Header Skeleton */}
    <div className="bg-card border-b border-border px-6 py-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="w-11 h-11 rounded-2xl" />
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>

    {/* Content Skeleton */}
    <div className="flex-1 overflow-hidden px-6 py-5 space-y-6">
      {/* Rewards Card Skeleton */}
      <Skeleton className="h-44 w-full rounded-3xl" />

      {/* Quick Action Skeleton */}
      <div className="bg-card rounded-3xl p-5 border border-border">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-56 mb-4" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* Quick Re-hire Skeleton */}
      <div>
        <div className="flex justify-between mb-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-32 h-40 rounded-2xl flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Categories Skeleton */}
      <div>
        <Skeleton className="h-5 w-36 mb-4" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const VendorHomeSkeleton = () => (
  <div className="flex flex-col h-screen bg-background">
    {/* Header Skeleton */}
    <div className="bg-foreground px-6 py-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <Skeleton className="h-7 w-44 mb-2 bg-background/20" />
          <Skeleton className="h-5 w-32 bg-background/20" />
        </div>
        <Skeleton className="w-11 h-11 rounded-2xl bg-background/20" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-2xl bg-background/10" />
        ))}
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="flex-1 overflow-hidden px-6 py-5 space-y-6">
      {/* Performance Cards */}
      <div>
        <Skeleton className="h-5 w-48 mb-3" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-28 rounded-3xl" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>

      {/* Weekly Trend */}
      <Skeleton className="h-28 rounded-3xl" />

      {/* Available Jobs */}
      <div>
        <div className="flex justify-between mb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const MessagesSkeleton = () => (
  <div className="flex flex-col h-screen bg-background">
    <div className="bg-card border-b border-border px-6 py-5">
      <Skeleton className="h-7 w-28 mb-4" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
    <div className="flex-1 px-6 py-4 space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-3 p-3">
          <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="flex flex-col h-screen bg-background">
    <div className="bg-foreground px-6 py-8">
      <div className="flex flex-col items-center">
        <Skeleton className="w-24 h-24 rounded-full mb-4 bg-background/20" />
        <Skeleton className="h-6 w-36 mb-2 bg-background/20" />
        <Skeleton className="h-4 w-44 bg-background/20" />
      </div>
    </div>
    <div className="flex-1 px-6 py-5 space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-14 rounded-2xl" />
      ))}
    </div>
  </div>
);
