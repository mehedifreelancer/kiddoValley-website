import ProductGridSkeleton from "./Productgridskeleton";
import { SkeletonBlock } from "./Skeletonbase";


export default function ProductsPageSkeleton() {
  return (
    <section>
      <div className="container-md mx-auto px-4 sm:px-6 lg:px-8 my-[50px]">
        <div className="text-center mb-12">
          <SkeletonBlock className="h-9 w-56 mx-auto mb-3" />
          <SkeletonBlock className="h-4 w-40 mx-auto" />
        </div>
        <ProductGridSkeleton count={12} />
      </div>
    </section>
  );
}