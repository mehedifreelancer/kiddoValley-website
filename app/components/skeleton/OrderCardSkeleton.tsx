// components/skeleton/OrderCardSkeleton.tsx
// ✅ TrackOrderPage-এর order card লেআউট মিলিয়ে বানানো (invoice/name/price বাম দিকে, status badge/action ডান দিকে)

import { SkeletonBlock } from "./Skeletonbase";

interface OrderCardSkeletonProps {
  count?: number;
}

export default function OrderCardSkeleton({
  count = 3,
}: OrderCardSkeletonProps) {
  return (
    <div className="mt-8 space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-lg p-5 sm:p-6 border border-white/30 dark:border-white/10"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex-1 w-full">
              <SkeletonBlock className="h-3 w-24 mb-2" />
              <SkeletonBlock className="h-5 w-40 mb-2" />
              <SkeletonBlock className="h-4 w-20 mb-2" />
              <SkeletonBlock className="h-3 w-16" />
            </div>
            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
              <SkeletonBlock className="h-6 w-20 rounded-full" />
              <SkeletonBlock className="h-9 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
