// components/skeleton/ListCardSkeleton.tsx
// ✅ শুধু লিস্ট আইটেম(গুলো) — যখন শুধু list/search API hit হয় (form/heading রিফ্রেশ হয় না)
// worksheets-এর প্রতিটা row-এর সাথে মিলিয়ে বানানো, generic নাম দেওয়া হলো যাতে
// অন্য কোনো list পেজেও (একই card layout হলে) reuse করা যায়

import { SkeletonBlock } from "./Skeletonbase";

interface ListCardSkeletonProps {
  count?: number;
}

export default function ListCardSkeleton({ count = 5 }: ListCardSkeletonProps) {
  return (
    <div className="mt-8 space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-lg p-5 sm:p-6 border border-white/30 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex-1 flex items-center gap-3 w-full">
            <SkeletonBlock className="w-6 h-6 rounded-md flex-shrink-0" />
            <div className="flex-1">
              <SkeletonBlock className="h-5 w-3/4 sm:w-1/2 mb-2" />
              <SkeletonBlock className="h-3 w-20" />
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <SkeletonBlock className="h-9 flex-1 sm:w-32 rounded-lg" />
            <SkeletonBlock className="h-9 flex-1 sm:w-28 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
