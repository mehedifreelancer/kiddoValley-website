// components/products/AllProductSection.tsx
"use client";

import { motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { useEffect, useRef, useState } from "react";
import { getPublicProducts, Product } from "@/app/products/product.service";
import { getPublicGridSettings } from "@/app/homePage.service";
import Button from "./Button";

// ✅ নিরাপদ ম্যাপিং ফাংশন – অপরিবর্তিত
const mapProductToBook = (product: Product): any => {
  if (!product) {
    return {
      id: "0",
      name: "Unknown",
      slug: "unknown",
      price: 0,
      discount: 0,
      imageUrl: "/placeholder.jpg",
      category: "Uncategorized",
      author: "Unknown",
      rating: 4.5,
      videoUrl: null,
      inStock: "out of stock",
      variants: [],
      attributeOrderByPriority: [],
      thumbnailImage: "/placeholder.jpg",
      weight: 0,
      isForceOrder: false,
      forceOrderPriority: 0,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const defaultVariant = product.variants?.[0];
  const defaultPrice = defaultVariant?.price ?? 0;
  const defaultDiscount = defaultVariant?.discount ?? 0;
  const defaultInStock = defaultVariant?.inStock ?? "out of stock";

  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    price: defaultPrice,
    discount: defaultDiscount,
    imageUrl: product.thumbnailImage || "/placeholder.jpg",
    category: product.category?.name || "Uncategorized",
    author: product.variants?.[0]?.sku || "Unknown Author",
    rating: 4.5,
    videoUrl: product.videoUrl || null,
    inStock: defaultInStock,
    variants: product.variants || [],
    attributeOrderByPriority: product.attributeOrderByPriority || [],
    thumbnailImage: product.thumbnailImage || "/placeholder.jpg",
    weight: product.weight ?? 0.5,
    categoryObj: product.category,
    isForceOrder: product.isForceOrder,
    forceOrderPriority: product.forceOrderPriority,
    isPublished: product.isPublished,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

// ✅ নতুন প্রপস টাইপ
interface AllProductSectionProps {
  searchQuery?: string; // ← নতুন
  onClearSearch?: () => void; // ← নতুন prop
}

export default function AllProductSection({
  searchQuery = "",
  onClearSearch,
}: AllProductSectionProps) {
  // State for dynamic grid classes from layout settings
  const [gridClasses, setGridClasses] = useState(
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
  );

  // Fetch layout settings on mount
  useEffect(() => {
    let isMounted = true;
    getPublicGridSettings()
      .then((gridClasses) => {
        if (isMounted && gridClasses) {
          setGridClasses(gridClasses);
        }
      })
      .catch(() => {
        console.warn("Using default grid layout");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ সার্চ কোয়েরি দিয়ে ইনফিনিট কোয়েরি
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch, // refetch যখন searchQuery পরিবর্তন হবে
  } = useInfiniteQuery({
    queryKey: ["public-products", searchQuery], // ← searchQuery অন্তর্ভুক্ত
    queryFn: ({ pageParam = 1 }) =>
      getPublicProducts(pageParam, 12, searchQuery), // ← search পাঠানো
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    // যখন searchQuery পরিবর্তন হবে, তখন ডেটা রিফেচ হবে (queryKey কারণে)
  });

  // ✅ যখন searchQuery পরিবর্তন হবে, প্রথম পেজ রিফেচ করুন
  useEffect(() => {
    refetch();
  }, [searchQuery, refetch]);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const products = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) {
    return (
      <section className="py-16 bg-cream-50/50 dark:bg-dark-bg/50">
        <div className="container-md mx-auto px-4 sm:px-6 lg:px-8 my-[50px]">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 bg-cream-50/50 dark:bg-dark-bg/50">
        <div className="container-md mx-auto px-4 sm:px-6 lg:px-8 text-center my-[50px]">
          <p className="text-red-500">Failed to load products.</p>
        </div>
      </section>
    );
  }

  // ✅ খালি ফলাফল – সার্চ টার্ম সহ বার্তা
  // ✅ খালি ফলাফল – সার্চ টার্ম সহ বার্তা + cute GIF
  if (products.length === 0) {
    return (
      <section className="">
        <div className="container-md mx-auto px-4 sm:px-6 lg:px-8 my-[50px] text-center">
          {/* ✅ Cute Animated GIF */}
          <div className="flex justify-center mb-6">
            <img
              src="https://media.tenor.com/3bTxZ4Hd5cMAAAAi/empty-box.gif"
              alt="Empty box"
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
            />
          </div>
          <p className="text-gray-500 text-lg">
            {searchQuery ? (
              <>
                “
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  {searchQuery}
                </span>
                ” সার্চের সাথে মেলে এমন কোনো পণ্য পাওয়া যায়নি
              </>
            ) : (
              "কোনো পণ্য পাওয়া যায়নি"
            )}
          </p>

          {searchQuery && onClearSearch && (
            <div className="flex justify-center mt-4">
              <Button variant="outline" size="sm" onClick={onClearSearch}>
                ঠিকাছে ফিরে যাই
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="">
      <div className="container-md mx-auto px-1 md:px-4 sm:px-6 lg:px-8 my-[30px] md:my-[50px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-light text-stone-800 dark:text-stone-200 mb-1">
            {searchQuery ? (
              <>
                <span className="font-semibold bg-gradient-to-r from-[#E57373] to-[#BA68C8] bg-clip-text text-transparent">
                  "{searchQuery}"
                </span>{" "}
                এর জন্য ফলাফল
              </>
            ) : (
              <>
                সব{" "}
                <span className="font-semibold bg-gradient-to-r from-[#E57373] to-[#BA68C8] bg-clip-text text-transparent">
                  পণ্য
                </span>
              </>
            )}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            {searchQuery
              ? `${products.length} টি পণ্য পাওয়া গেছে`
              : "আমাদের সম্পূর্ণ সংগ্রহ দেখুন"}
          </p>
        </motion.div>

        {/* ✅ Dynamic grid classes */}
        <div className={gridClasses}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={mapProductToBook(product)}
              onAddToCart={() => {}}
            />
          ))}
        </div>

        {hasNextPage && (
          <div ref={loadMoreRef} className="flex justify-center py-8">
            {isFetchingNextPage && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            )}
          </div>
        )}

        {/* ✅ সার্চ থাকলে নিচে ফিরে যাওয়ার বাটন */}
        {searchQuery && onClearSearch && (
          <div className="flex justify-center mt-10">
            <Button variant="outline" size="sm" onClick={onClearSearch}>
              ঠিকাছে ফিরে যাই
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
