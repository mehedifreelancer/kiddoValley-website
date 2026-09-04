// components/skeleton/HeroSkeleton.tsx

import { SkeletonBlock, SkeletonCircle } from "./Skeletonbase";

export default function HeroSkeleton() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200 dark:from-dark-bg dark:via-dark-surface dark:to-dark-elevated">
      <div className="container-md mx-auto px-4 sm:px-6 lg:px-8 min-h-[520px] sm:min-h-[450px] md:h-[50vh] md:max-h-[600px] flex items-center">
        <div className=" sm:p-8 md:p-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
            {/* Left content */}
            <div>
              <SkeletonBlock className="h-7 w-32 rounded-full mb-4" />
              <SkeletonBlock className="h-8 w-3/4 mb-2" />
              <SkeletonBlock className="h-8 w-1/2 mb-4" />
              <SkeletonBlock className="h-4 w-full mb-2" />
              <SkeletonBlock className="h-4 w-5/6 mb-6" />
              <div className="flex gap-3">
                <SkeletonBlock className="h-11 w-28 rounded-lg" />
                <SkeletonBlock className="h-11 w-28 rounded-lg" />
              </div>
            </div>

            {/* Right – book images */}
            <div className="relative aspect-square max-w-sm mx-auto w-full">
              <SkeletonBlock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-xl" />
              <SkeletonCircle className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20" />
              <SkeletonCircle className="absolute bottom-0 left-0 w-14 h-14 sm:w-16 sm:h-16" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
