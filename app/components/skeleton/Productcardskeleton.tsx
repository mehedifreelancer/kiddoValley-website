// components/skeleton/ProductCardSkeleton.tsx
// ✅ কার্ডের wrapper-ও এখন সাইটের বাকি সব glass কার্ডের মতো transparent —
// আগে সলিড bg-white/gray-900 ছিল বলে ভেতরের transparent SkeletonBlock প্রায় দেখাই যেত না

import { SkeletonBlock } from "./Skeletonbase";

export default function ProductCardSkeleton() {
  return (
    <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-sm border border-white/30 dark:border-white/10 overflow-hidden h-full flex flex-col w-full">
      {/* Image */}
      <div className="relative aspect-[4/3]">
        <SkeletonBlock className="absolute inset-0 rounded-none" />
      </div>

      {/* Variant info row */}
      <div className="p-3 pb-2 border-b border-white/20 dark:border-white/10">
        <SkeletonBlock className="h-4 w-24" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow px-3 pb-4">
        <SkeletonBlock className="h-5 w-3/4 mt-3 mb-3" />

        <div className="flex items-center gap-2 mb-3">
          <SkeletonBlock className="h-6 w-16" />
          <SkeletonBlock className="h-4 w-12" />
        </div>

        <div className="flex gap-1.5 mb-4">
          <SkeletonBlock className="h-5 w-10" />
          <SkeletonBlock className="h-5 w-10" />
          <SkeletonBlock className="h-5 w-10" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto pt-2 border-t border-white/20 dark:border-white/10">
          <SkeletonBlock className="h-9 w-full rounded-lg" />
          <SkeletonBlock className="h-9 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
