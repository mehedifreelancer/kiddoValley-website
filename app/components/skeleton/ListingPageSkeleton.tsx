// components/skeleton/ListingPageSkeleton.tsx
// ✅ পুরো পেজের জন্য — heading + search form + list cards (প্রথম page-load এ)
// ভেতরে ListCardSkeleton reuse করা হলো, যাতে দুই জায়গায় একই markup ডুপ্লিকেট না হয়

import ListCardSkeleton from "./ListCardSkeleton";
import { SkeletonBlock } from "./Skeletonbase";

interface ListingPageSkeletonProps {
  itemCount?: number;
}

export default function ListingPageSkeleton({
  itemCount = 5,
}: ListingPageSkeletonProps) {
  return (
    <div className="max-w-4xl mx-auto relative z-10">
      {/* ===== Heading ===== */}
      <div className="text-center mb-10">
        <SkeletonBlock className="h-9 w-64 mx-auto mb-3" />
        <SkeletonBlock className="h-4 w-80 max-w-full mx-auto" />
      </div>

      {/* ===== Search Form ===== */}
      <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/30 dark:border-white/10">
        <div className="flex flex-col sm:flex-row gap-3">
          <SkeletonBlock className="h-[50px] flex-1 rounded-xl" />
          <SkeletonBlock className="h-[50px] w-full sm:w-32 rounded-xl" />
        </div>
      </div>

      {/* ===== List Items ===== */}
      <ListCardSkeleton count={itemCount} />
    </div>
  );
}
