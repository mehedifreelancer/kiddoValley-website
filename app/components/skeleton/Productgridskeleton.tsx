import ProductCardSkeleton from "./Productcardskeleton";


interface ProductGridSkeletonProps {
  count?: number;
  gridClasses?: string;
}

export default function ProductGridSkeleton({
  count = 8,
  gridClasses = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
}: ProductGridSkeletonProps) {
  return (
    <div className={gridClasses}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
