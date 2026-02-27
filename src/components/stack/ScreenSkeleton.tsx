import React from 'react';

const Skel = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`rounded-xl bg-muted shimmer ${className}`} {...props} />
);

export type SkeletonType = 'consumer-home' | 'vendor-home' | 'messages' | 'profile' | 'list' | 'detail' | 'chat' | 'default';

export const getSkeletonForRoute = (path: string): React.ReactNode => {
  if (path === '/consumer' || path.startsWith('/consumer')) return <ConsumerHomeSkeleton />;
  if (path === '/vendor' || path.startsWith('/vendor')) return <VendorHomeSkeleton />;
  if (path === '/messages' || path.startsWith('/chat')) return <MessagesSkeleton />;
  if (path === '/profile' || path === '/rewards') return <ProfileSkeleton />;
  if (path === '/jobs' || path === '/notifications' || path === '/services') return <ListSkeleton />;
  if (path.startsWith('/job/') || path.startsWith('/request/') || path.startsWith('/quote-management/')) return <DetailSkeleton />;
  return <DefaultSkeleton />;
};

export const DefaultSkeleton = () => (
  <div className="flex flex-col h-full bg-background items-center justify-center">
    <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
  </div>
);

export const ListSkeleton = () => (
  <div className="flex flex-col h-full bg-background p-4 space-y-4">
    <div className="flex items-center gap-3 pt-12 pb-4">
      <Skel className="h-10 w-10 rounded-full" />
      <Skel className="h-5 w-28" />
    </div>
    <Skel className="h-10 w-full" />
    <div className="flex gap-2">
      {[1, 2, 3].map(i => <Skel key={i} className="h-7 w-16 rounded-full" />)}
    </div>
    <div className="space-y-2 flex-1">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
          <Skel className="h-12 w-12 rounded-xl" />
          <div className="flex-1 space-y-1.5">
            <Skel className="h-4 w-3/4" />
            <Skel className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const DetailSkeleton = () => (
  <div className="flex flex-col h-full bg-background p-4 space-y-5">
    <div className="flex items-center gap-3 pt-12">
      <Skel className="h-10 w-10 rounded-full" />
      <Skel className="h-5 w-20" />
    </div>
    <Skel className="h-40 w-full rounded-xl" />
    <div className="space-y-2">
      <Skel className="h-6 w-3/4" />
      <Skel className="h-4 w-full" />
      <Skel className="h-4 w-2/3" />
    </div>
    <div className="flex gap-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex-1 p-3 rounded-xl bg-card border border-border">
          <Skel className="h-5 w-10 mb-1.5" />
          <Skel className="h-3 w-14" />
        </div>
      ))}
    </div>
    <div className="mt-auto pb-6">
      <Skel className="h-12 w-full rounded-xl" />
    </div>
  </div>
);

export const ConsumerHomeSkeleton = () => (
  <div className="flex flex-col h-full bg-background">
    <div className="border-b border-border px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Skel className="h-6 w-28 mb-1.5" />
          <Skel className="h-4 w-40" />
        </div>
        <div className="flex gap-2">
          <Skel className="w-10 h-10 rounded-xl" />
          <Skel className="w-10 h-10 rounded-xl" />
        </div>
      </div>
      <Skel className="h-10 w-full rounded-xl" />
    </div>
    <div className="flex-1 px-4 py-4 space-y-5">
      <div className="bg-card rounded-xl border border-border p-4">
        <Skel className="h-5 w-44 mb-2" />
        <Skel className="h-4 w-56 mb-3" />
        <Skel className="h-12 w-full rounded-xl" />
      </div>
      <div>
        <Skel className="h-4 w-24 mb-3" />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-20 rounded-xl bg-card border border-border p-3 flex flex-col items-center justify-center">
              <Skel className="w-9 h-9 rounded-xl mb-1.5" />
              <Skel className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const VendorHomeSkeleton = () => (
  <div className="flex flex-col h-full bg-background">
    <div className="border-b border-border px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skel className="w-10 h-10 rounded-xl" />
          <div>
            <Skel className="h-5 w-36 mb-1.5" />
            <Skel className="h-4 w-24" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skel className="w-10 h-10 rounded-xl" />
          <Skel className="w-10 h-10 rounded-xl" />
        </div>
      </div>
    </div>
    <div className="flex-1 px-4 py-4 space-y-4">
      <Skel className="h-14 w-full rounded-xl" />
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 rounded-xl bg-card border border-border p-3">
            <Skel className="w-8 h-8 rounded-lg mb-1.5" />
            <Skel className="h-3 w-14" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2].map(i => (
          <div key={i} className="h-20 rounded-xl bg-card border border-border p-3">
            <div className="flex gap-2.5 mb-2">
              <Skel className="w-9 h-9 rounded-xl" />
              <div className="flex-1">
                <Skel className="h-4 w-36 mb-1.5" />
                <Skel className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const MessagesSkeleton = () => (
  <div className="flex flex-col h-full bg-background">
    <div className="border-b border-border px-4 py-4">
      <Skel className="h-6 w-24 mb-3" />
      <Skel className="h-10 w-full rounded-xl" />
    </div>
    <div className="flex-1 px-4 py-3 space-y-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex gap-3 p-3 bg-card rounded-xl border border-border">
          <Skel className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <Skel className="h-4 w-28 mb-1.5" />
            <Skel className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="flex flex-col h-full bg-background">
    <div className="border-b border-border px-4 py-5">
      <Skel className="h-6 w-16 mb-4" />
      <div className="bg-secondary/50 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <Skel className="w-14 h-14 rounded-xl" />
          <div className="flex-1">
            <Skel className="h-5 w-32 mb-1.5" />
            <Skel className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
    <div className="flex-1 px-4 py-4 space-y-2">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-12 rounded-xl p-3 flex items-center gap-3">
          <Skel className="w-5 h-5" />
          <Skel className="h-4 flex-1" />
        </div>
      ))}
    </div>
  </div>
);
