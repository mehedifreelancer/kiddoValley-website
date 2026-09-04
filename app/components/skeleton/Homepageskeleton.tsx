import HeroSkeleton from "./Heroskeleton";
import ProductGridSkeleton from "./Productgridskeleton";
import { SkeletonBlock } from "./Skeletonbase";

export default function HomePageSkeleton() {
  return (
    <div className="bg-stone-200/70 dark:bg-white/10">
      <HeroSkeleton />
      <section className="py-16">
        <div className="container-md mx-auto px-4 sm:px-6 lg:px-8 my-[50px]">
          <div className="text-center mb-12">
            <SkeletonBlock className="h-8 w-48 mx-auto mb-3" />
            <SkeletonBlock className="h-4 w-64 mx-auto" />
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </section>
    </div>
  );
}
