import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

/** Consumer Home refresh skeleton */
export const ConsumerRefreshSkeleton = () => (
  <div className="px-4 py-5 pb-24 space-y-6">
    {/* Rewards Card Skeleton */}
    <div className="rounded-3xl p-5 bg-gradient-to-br from-primary/20 to-primary/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-3xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-6 w-16 ml-auto" />
          <Skeleton className="h-3 w-12 ml-auto" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-2xl" />
    </div>

    {/* Quick Action Skeleton */}
    <div className="rounded-3xl border border-border p-5 bg-card">
      <div className="space-y-2 mb-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-12 w-full rounded-2xl" />
    </div>

    {/* Quick Re-hire Skeleton */}
    <div>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex-shrink-0 w-32 bg-card p-4 rounded-3xl border border-border"
          >
            <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
            <Skeleton className="h-4 w-20 mx-auto mb-1" />
            <Skeleton className="h-3 w-12 mx-auto mb-3" />
            <Skeleton className="h-8 w-full rounded-xl" />
          </motion.div>
        ))}
      </div>
    </div>

    {/* Categories Skeleton */}
    <div>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card p-4 rounded-3xl border border-border"
          >
            <Skeleton className="w-10 h-10 rounded-2xl mx-auto mb-2" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

/** Vendor Home refresh skeleton */
export const VendorRefreshSkeleton = () => (
  <div className="px-4 py-4 pb-24 space-y-4">
    {/* Availability Toggle Skeleton */}
    <div className="rounded-2xl border border-border p-4 bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="w-14 h-7 rounded-full" />
      </div>
    </div>

    {/* Priority Cards Skeleton */}
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl border border-border p-3 bg-card"
        >
          <div className="flex items-center justify-between mb-1.5">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
          <Skeleton className="h-3 w-20 mb-1" />
          <Skeleton className="h-2 w-16" />
        </motion.div>
      ))}
    </div>

    {/* Performance Metrics Skeleton */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-card rounded-2xl border border-border p-3 text-center"
          >
            <Skeleton className="w-8 h-8 rounded-xl mx-auto mb-2" />
            <Skeleton className="h-6 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-10 mx-auto mb-1" />
            <Skeleton className="h-2 w-16 mx-auto" />
          </motion.div>
        ))}
      </div>
    </div>

    {/* AI Market Card Skeleton */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl border border-primary/20 p-4 bg-gradient-to-br from-primary/5 to-primary/10"
    >
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <Skeleton className="h-24 w-full rounded-xl mb-3" />
      <Skeleton className="h-9 w-full rounded-xl" />
    </motion.div>

    {/* Leads Skeleton */}
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-5 w-44" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            <div className="flex items-start gap-3 mb-2">
              <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="w-16 h-6 rounded-full" />
            </div>
            <Skeleton className="h-8 w-full rounded-xl" />
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);
