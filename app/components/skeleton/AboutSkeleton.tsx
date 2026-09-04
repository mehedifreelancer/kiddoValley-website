// components/skeleton/AboutSkeleton.tsx
// ✅ AboutPage.tsx এর লেআউট মিলিয়ে বানানো — Hero, Mission/Vision, Story, Stats, Values, CTA
// সাইটের বাকি glass কার্ডগুলোর সাথে মিলিয়ে backdrop-blur + transparent বেস ব্যবহার করা হলো

import { SkeletonBlock, SkeletonCircle } from "./Skeletonbase";

export default function AboutSkeleton() {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:py-12">
      <div className="fixed inset-0 bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200 dark:from-dark-bg dark:via-dark-surface dark:to-dark-elevated -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ===== Hero ===== */}
        <div className="text-center mb-16">
          <SkeletonBlock className="h-10 sm:h-12 md:h-14 w-64 sm:w-80 mx-auto mb-4" />
          <SkeletonBlock className="h-5 w-72 sm:w-96 max-w-full mx-auto" />
        </div>

        {/* ===== Mission & Vision ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-3xl shadow-2xl p-8 border border-white/30 dark:border-white/10 h-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <SkeletonCircle className="w-12 h-12" />
                <SkeletonBlock className="h-6 w-32" />
              </div>
              <SkeletonBlock className="h-4 w-full mb-2" />
              <SkeletonBlock className="h-4 w-full mb-2" />
              <SkeletonBlock className="h-4 w-5/6" />
            </div>
          ))}
        </div>

        {/* ===== Our Story ===== */}
        <div className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/30 dark:border-white/10 mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 w-full">
              <SkeletonBlock className="h-7 w-48 mb-4" />
              <SkeletonBlock className="h-4 w-full mb-2" />
              <SkeletonBlock className="h-4 w-full mb-2" />
              <SkeletonBlock className="h-4 w-3/4 mb-4" />
              <SkeletonBlock className="h-4 w-full mb-2" />
              <SkeletonBlock className="h-4 w-5/6" />
            </div>
            <div className="flex-1 flex justify-center">
              <SkeletonCircle className="w-48 h-48 md:w-64 md:h-64" />
            </div>
          </div>
        </div>

        {/* ===== Statistics ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-lg p-6 text-center border border-white/30 dark:border-white/10"
            >
              <SkeletonCircle className="w-8 h-8 mx-auto mb-2" />
              <SkeletonBlock className="h-7 w-16 mx-auto mb-2" />
              <SkeletonBlock className="h-4 w-12 mx-auto" />
            </div>
          ))}
        </div>

        {/* ===== Core Values ===== */}
        <div className="text-center mb-8">
          <SkeletonBlock className="h-7 w-48 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="backdrop-blur-xl bg-white/20 dark:bg-black/30 rounded-2xl shadow-lg p-6 text-center border border-white/30 dark:border-white/10"
            >
              <SkeletonCircle className="w-10 h-10 mx-auto mb-3" />
              <SkeletonBlock className="h-5 w-28 mx-auto mb-3" />
              <SkeletonBlock className="h-4 w-full mb-2" />
              <SkeletonBlock className="h-4 w-5/6 mx-auto" />
            </div>
          ))}
        </div>

        {/* ===== Call to Action ===== */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-[#E57373]/10 via-[#BA68C8]/10 to-[#9575CD]/10 dark:from-[#E57373]/5 dark:via-[#BA68C8]/5 dark:to-[#9575CD]/5 rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-white/30 dark:border-white/10">
          <SkeletonBlock className="h-7 w-64 mx-auto mb-4" />
          <SkeletonBlock className="h-4 w-full max-w-md mx-auto mb-2" />
          <SkeletonBlock className="h-4 w-3/4 max-w-sm mx-auto mb-6" />
          <div className="flex justify-center">
            <SkeletonBlock className="h-12 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
